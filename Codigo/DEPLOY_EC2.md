# Despliegue en EC2

Esta guía despliega la aplicación completa en una única instancia EC2 con Docker Compose:

```text
EC2
└── Docker Compose
    ├── Caddy
    ├── frontend-postulantes
    ├── frontend-admin
    ├── backend
    └── MariaDB
```

Caddy es el único servicio publicado hacia Internet. Recibe HTTP/HTTPS en los puertos `80` y `443`, obtiene certificados TLS automáticamente mediante ACME, redirige HTTP a HTTPS y enruta por hostname hacia los frontends internos.

La API y MariaDB solo existen dentro de redes de Docker. No se deben abrir públicamente los puertos `3000`, `3306` ni `8080`.

## 1. Antes de desplegar

1. Revocar la clave de Firebase que estuvo versionada en `backend/firebase/serviceAccount.js` y crear una nueva. Eliminarla del archivo actual no la elimina del historial de Git.
2. Crear una EC2 con Amazon Linux 2023, almacenamiento EBS cifrado, IP publica estable y un rol IAM para Systems Manager.
3. Preferir Session Manager para administrar la instancia sin abrir SSH. AWS documenta que permite acceso sin puertos entrantes ni claves SSH: [Session Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html).
4. Definir los dos nombres DNS que se usaran en produccion:
   - `PUBLIC_DOMAIN`, por ejemplo `empleos.example.com`.
   - `ADMIN_DOMAIN`, por ejemplo `admin-empleos.example.com`.

## 2. Red y HTTPS

La instancia EC2 necesita aceptar solamente:

```text
80/tcp
443/tcp
```

No abrir publicamente:

```text
3000/tcp
3306/tcp
8080/tcp
```

Si se usa Session Manager, tampoco hace falta abrir `22/tcp`.

`compose.prod.yml` publica unicamente Caddy:

```text
80:80
443:443
```

Los frontends, el backend y MariaDB se comunican por redes internas de Docker. Caddy no expone directamente el backend; solo enruta por hostname hacia el Nginx interno de cada frontend.

## 3. DNS

Crear o actualizar los registros DNS para que ambos nombres apunten a la IP publica estable de la EC2:

```text
PUBLIC_DOMAIN -> IP publica de la EC2
ADMIN_DOMAIN  -> IP publica de la EC2
```

No es obligatorio usar Route 53. El dominio puede estar en cualquier proveedor DNS.

## 4. HTTPS con Caddy

Caddy obtiene y renueva automaticamente los certificados mediante ACME cuando se cumplen estas condiciones:

1. Los registros DNS ya resuelven a la EC2.
2. Los puertos `80` y `443` estan accesibles desde Internet.
3. El servicio `caddy` esta iniciado.

No se usan certificados manuales, claves TLS en Git, variables de entorno con claves privadas ni un balanceador externo.

## 5. Instalar Docker

En Amazon Linux 2023:

```bash
sudo yum update -y
sudo yum install -y docker git
sudo systemctl enable --now docker
sudo usermod -aG docker ec2-user
```

Cerrar y volver a abrir la sesión. AWS mantiene estos pasos en su [guía de Docker para Amazon Linux 2023](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/create-container-image.html).

Comprobar:

```bash
docker info
docker compose version
```

Si el segundo comando no existe, instalar el plugin oficial de Compose:

```bash
sudo mkdir -p /usr/local/lib/docker/cli-plugins
sudo curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
docker compose version
```

## 6. Configurar la aplicación

```bash
git clone https://github.com/LeandroMurillo/Trabajo-Graduacion.git
cd Trabajo-Graduacion/Codigo
cp .env.production.example .env.production
chmod 600 .env.production
```

Editar `.env.production` y reemplazar todos los valores. El nombre de la base esta fijado como `proyecto` en `compose.prod.yml` porque los scripts SQL usan ese esquema.

Generar secretos independientes, por ejemplo:

```bash
openssl rand -hex 32
openssl rand -base64 36
```

Reglas importantes:

- `PUBLIC_DOMAIN` debe ser el hostname publico del frontend de postulantes.
- `ADMIN_DOMAIN` debe ser el hostname publico del frontend administrativo.
- `APP_ORIGINS` debe contener esos dos origenes HTTPS exactos, separados por coma y sin `/` final.
- `FIREBASE_SERVICE_ACCOUNT_JSON` debe ser el JSON nuevo, minificado en una sola línea.
- Las variables `VITE_FIREBASE_*` son configuración pública del SDK web; la cuenta de servicio nunca debe usar el prefijo `VITE_`.
- No guardar la contraseña inicial del `SUPERADMIN` en `.env.production`. Se ingresa manualmente una sola vez durante el provisioning inicial.
- Cuando los dominios definitivos esten funcionando, agregarlos en Firebase Authentication -> Authorized domains si los flujos de autenticacion lo requieren.

## 7. Iniciar y verificar

```bash
docker compose --env-file .env.production -f compose.prod.yml config
docker compose --env-file .env.production -f compose.prod.yml up -d --build --wait
docker compose --env-file .env.production -f compose.prod.yml ps
```

Los cinco servicios deben quedar `healthy`. Si Caddy no obtiene certificados o no responde, revisar sus logs:

```bash
docker compose --env-file .env.production -f compose.prod.yml logs --tail 100 caddy
```

Verificar desde fuera de AWS, usando los dominios reales configurados en `.env.production`:

```bash
curl -I https://PUBLIC_DOMAIN/health
curl -I https://ADMIN_DOMAIN/health
```

La inicialización de MariaDB carga solamente esquema, tablas, relaciones, stored procedures y objetos estructurales. No carga datos de demostración ni usuarios administrativos.

Verificar que las tablas principales estén vacías:

```bash
docker compose --env-file .env.production -f compose.prod.yml exec -T db \
  sh -c 'mariadb -u"$MARIADB_USER" -p"$MARIADB_PASSWORD" "$MARIADB_DATABASE" -e "
    SELECT ''Empresas'' tabla, COUNT(*) filas FROM Empresas
    UNION ALL SELECT ''Administradores'', COUNT(*) FROM Administradores
    UNION ALL SELECT ''Categorias'', COUNT(*) FROM Categorias
    UNION ALL SELECT ''Vacantes'', COUNT(*) FROM Vacantes
    UNION ALL SELECT ''Postulantes'', COUNT(*) FROM Postulantes;"'
```

Todas deben devolver `0`.

## 8. Crear el primer SUPERADMIN

Esta operación es excepcional y se debe ejecutar una sola vez luego de inicializar MariaDB. Falla si ya existe un `SUPERADMIN`, crea u obtiene la empresa de sistema `Plataforma`, valida email y contraseña, guarda solo el hash bcrypt y no crea ninguna cuenta de Firebase.

No pasar la contraseña por argumentos, variables de entorno, archivos `.env` ni comandos que queden en el historial. El script siguiente se crea temporalmente, se copia a `/tmp` del contenedor backend, pide la contraseña de forma interactiva y se elimina al terminar.

```bash
PROVISION_SCRIPT=/tmp/create-superadmin.mjs

cleanup_superadmin_provisioning() {
  rm -f "$PROVISION_SCRIPT"
  docker compose --env-file .env.production -f compose.prod.yml exec -T backend \
    rm -f /tmp/create-superadmin.mjs >/dev/null 2>&1 || true
}

trap cleanup_superadmin_provisioning EXIT

cat > "$PROVISION_SCRIPT" <<'NODE'
import fs from 'node:fs';
import tty from 'node:tty';
import readline from 'node:readline/promises';
import { createRequire } from 'node:module';

import pool from '/app/dist/database.js';

const require = createRequire('/app/package.json');
const bcrypt = require('bcryptjs');

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  const checks = [
    password.length >= 12,
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];

  return checks.every(Boolean);
}

async function readLine(prompt) {
  const input = fs.createReadStream('/dev/tty');
  const output = fs.createWriteStream('/dev/tty');
  const rl = readline.createInterface({ input, output });

  try {
    return await rl.question(prompt);
  } finally {
    rl.close();
    input.close();
    output.close();
  }
}

function readPassword(prompt) {
  return new Promise((resolve, reject) => {
    const inputFd = fs.openSync('/dev/tty', 'r');
    const outputFd = fs.openSync('/dev/tty', 'w');
    const input = new tty.ReadStream(inputFd);
    const output = new tty.WriteStream(outputFd);
    let password = '';

    const finish = (error) => {
      input.setRawMode(false);
      input.pause();
      output.write('\n');
      input.destroy();
      output.destroy();

      if (error) {
        reject(error);
      } else {
        resolve(password);
      }
    };

    output.write(prompt);
    input.setRawMode(true);
    input.resume();
    input.setEncoding('utf8');

    input.on('data', (chunk) => {
      for (const char of chunk) {
        if (char === '\u0003') {
          finish(new Error('Operacion cancelada.'));
          return;
        }

        if (char === '\r' || char === '\n') {
          finish();
          return;
        }

        if (char === '\u007f' || char === '\b') {
          password = password.slice(0, -1);
          continue;
        }

        password += char;
      }
    });

    input.on('error', finish);
  });
}

const existingRows = await pool.query(
  "SELECT idAdministrador FROM Administradores WHERE rol = 'SUPERADMIN' LIMIT 1",
);

if (existingRows.length > 0) {
  await pool.end();
  throw new Error('Ya existe un SUPERADMIN. No se modifico la base.');
}

const email = (await readLine('Email SUPERADMIN: ')).trim().toLowerCase();
if (!validateEmail(email)) {
  await pool.end();
  throw new Error('Email invalido.');
}

const password = await readPassword('Password SUPERADMIN: ');
const passwordConfirmation = await readPassword('Confirmar password: ');

if (password !== passwordConfirmation) {
  await pool.end();
  throw new Error('Las passwords no coinciden.');
}

if (!validatePassword(password)) {
  await pool.end();
  throw new Error('La password debe tener al menos 12 caracteres e incluir minuscula, mayuscula, numero y simbolo.');
}

const connection = await pool.getConnection();

try {
  await connection.beginTransaction();

  const superadminRows = await connection.query(
    "SELECT idAdministrador FROM Administradores WHERE rol = 'SUPERADMIN' LIMIT 1 FOR UPDATE",
  );

  if (superadminRows.length > 0) {
    throw new Error('Ya existe un SUPERADMIN. No se modifico la base.');
  }

  const empresaResult = await connection.query(
    `INSERT INTO Empresas (empresa, url, estilo, estado, esSistema)
     VALUES ('Plataforma', 'admin', NULL, 'A', 1)
     ON DUPLICATE KEY UPDATE idEmpresa = LAST_INSERT_ID(idEmpresa)`,
  );
  const idEmpresa = Number(empresaResult.insertId);
  const passwordHash = await bcrypt.hash(password, 12);

  await connection.query(
    `INSERT INTO Administradores (idEmpresa, email, clave, rol)
     VALUES (?, ?, ?, 'SUPERADMIN')`,
    [idEmpresa, email, passwordHash],
  );

  await connection.commit();
  console.log(`SUPERADMIN creado: ${email}`);
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  connection.release();
  await pool.end();
}
NODE

chmod 600 "$PROVISION_SCRIPT"
docker compose --env-file .env.production -f compose.prod.yml cp "$PROVISION_SCRIPT" backend:/tmp/create-superadmin.mjs
docker compose --env-file .env.production -f compose.prod.yml exec backend node /tmp/create-superadmin.mjs
cleanup_superadmin_provisioning
trap - EXIT
```

Verificar que exista exactamente un `SUPERADMIN` y que pertenezca a la empresa de sistema:

```bash
docker compose --env-file .env.production -f compose.prod.yml exec -T db \
  sh -c 'mariadb -u"$MARIADB_USER" -p"$MARIADB_PASSWORD" "$MARIADB_DATABASE" -e "
    SELECT a.email, a.rol, e.empresa, e.url, e.esSistema
    FROM Administradores a
    JOIN Empresas e USING (idEmpresa)
    WHERE a.rol = ''SUPERADMIN'';
    SELECT COUNT(*) AS superadmins FROM Administradores WHERE rol = ''SUPERADMIN'';"'
```

Si se ejecuta una segunda vez, debe fallar con `Ya existe un SUPERADMIN. No se modifico la base.`

## 9. Actualizar

```bash
cd Trabajo-Graduacion
git pull --ff-only
cd Codigo
docker compose --env-file .env.production -f compose.prod.yml up -d --build --wait
docker image prune -f
```

## 10. Backups

La base vive en el volumen `mariadb-data`. Crear dumps periódicos y guardarlos fuera de la instancia:

```bash
mkdir -p backups
docker compose --env-file .env.production -f compose.prod.yml exec -T db \
  sh -c 'mariadb-dump -u"$MARIADB_USER" -p"$MARIADB_PASSWORD" "$MARIADB_DATABASE"' \
  | gzip > "backups/proyecto-$(date +%F-%H%M%S).sql.gz"
```

Configurar además snapshots automáticos del volumen EBS mediante Data Lifecycle Manager o AWS Backup. AWS aclara que los volúmenes EBS no se respaldan automáticamente: [snapshots de EBS](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-snapshots.html).

## Operación rápida

```bash
# Estado
docker compose --env-file .env.production -f compose.prod.yml ps

# Logs en vivo
docker compose --env-file .env.production -f compose.prod.yml logs -f --tail 100

# Reiniciar solo el backend
docker compose --env-file .env.production -f compose.prod.yml restart backend

# Detener sin borrar la base
docker compose --env-file .env.production -f compose.prod.yml down
```

No ejecutar `down --volumes` en producción: elimina el volumen de MariaDB.
