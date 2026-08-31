# Despliegue en EC2

Esta guía usa `compose.prod.yml` y dos nombres DNS:

- `empleos.example.com` apunta al frontend de postulantes (puerto 80 de la EC2).
- `admin-empleos.example.com` apunta al frontend administrativo (puerto 8080 de la EC2).

La API y MariaDB solo existen dentro de las redes de Docker. No se deben abrir los puertos 3000 ni 3306 en el Security Group.

## 1. Antes de desplegar

1. Revocar la clave de Firebase que estuvo versionada en `backend/firebase/serviceAccount.js` y crear una nueva. Eliminarla del archivo actual no la elimina del historial de Git.
2. Solicitar en ACM un certificado que cubra los dos nombres DNS.
3. Crear una EC2 con Amazon Linux 2023, almacenamiento EBS cifrado y un rol IAM para Systems Manager.
4. Preferir Session Manager para administrar la instancia sin abrir SSH. AWS documenta que permite acceso sin puertos entrantes ni claves SSH: [Session Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html).

## 2. Red y HTTPS

Crear un Application Load Balancer público con listener HTTPS 443 y certificado de ACM. AWS recomienda ACM para los certificados del ALB: [certificados HTTPS](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/https-listener-certificates.html).

Configurar dos target groups de tipo `instance`:

| Host | Puerto del target | Health check |
| --- | ---: | --- |
| `empleos.example.com` | 80 | `/health` |
| `admin-empleos.example.com` | 8080 | `/health` |

En el listener 443, crear reglas por `Host header` para dirigir cada dominio a su target group. El listener 80 del ALB debe redirigir a HTTPS.

Security Groups:

- ALB: entrada 80/443 desde Internet; salida 80/8080 hacia el Security Group de la EC2.
- EC2: entrada 80/8080 solamente desde el Security Group del ALB.
- No abrir 3000 ni 3306. Si se usa Session Manager, tampoco hace falta abrir 22.

AWS recomienda limitar los targets para que acepten tráfico exclusivamente desde el Security Group del ALB: [reglas recomendadas](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-update-security-groups.html).

## 3. Instalar Docker

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

## 4. Configurar la aplicación

```bash
git clone https://github.com/LeandroMurillo/Trabajo-Graduacion.git
cd Trabajo-Graduacion/Codigo
cp .env.production.example .env.production
chmod 600 .env.production
```

Editar `.env.production` y reemplazar todos los valores. El nombre de la base está fijado como `proyecto` en `compose.prod.yml` porque los scripts SQL usan ese esquema.

Generar secretos independientes, por ejemplo:

```bash
openssl rand -hex 32
openssl rand -base64 36
```

Reglas importantes:

- `APP_ORIGINS` debe contener los dos orígenes HTTPS exactos, separados por coma y sin `/` final.
- `FIREBASE_SERVICE_ACCOUNT_JSON` debe ser el JSON nuevo, minificado en una sola línea.
- Las variables `VITE_FIREBASE_*` son configuración pública del SDK web; la cuenta de servicio nunca debe usar el prefijo `VITE_`.
- `BOOTSTRAP_SUPERADMIN_PASSWORD` debe ser única y tener al menos 12 caracteres.

## 5. Iniciar y verificar

```bash
docker compose --env-file .env.production -f compose.prod.yml config
docker compose --env-file .env.production -f compose.prod.yml up -d --build --wait
docker compose --env-file .env.production -f compose.prod.yml ps
docker compose --env-file .env.production -f compose.prod.yml logs --tail 100 backend
```

Los cuatro servicios deben quedar `healthy`. Verificar desde fuera de AWS:

```bash
curl -I https://empleos.example.com/health
curl -I https://admin-empleos.example.com/health
```

Después del primer arranque correcto, cambiar la contraseña desde la aplicación y borrar el valor de `BOOTSTRAP_SUPERADMIN_PASSWORD` del entorno. El bootstrap no vuelve a crear el usuario si ya existe un `SUPERADMIN`.

## 6. Actualizar

```bash
cd Trabajo-Graduacion
git pull --ff-only
cd Codigo
docker compose --env-file .env.production -f compose.prod.yml up -d --build --wait
docker image prune -f
```

## 7. Backups

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
