# Trabajo de Graduación

[Leandro Murillo](mailto:leandromurillo00@gmail.com)
42221212

[César Ezequiel Herrera](mailto:cesar.ezequiel.herrera@gmail.com)
38737903

Este proyecto es una plataforma dividida en múltiples servicios (Backend, Frontend para Postulantes y Frontend para Administradores) dockerizados para un despliegue rápido y un entorno de desarrollo estandarizado.

## Requisitos Previos e Instalación

Para ejecutar este proyecto, necesitas una API de firebase y tener instaladas varias herramientas fundamentales.

### Para usuarios de Arch Linux:

Puedes instalar todas las dependencias necesarias de una sola vez utilizando `pacman`:

```bash
sudo pacman -S git docker docker-compose docker-buildx npm
```

Asegúrate de iniciar y habilitar el servicio de Docker después de instalarlo:

```bash
sudo systemctl enable --now docker
```

### Para otros sistemas operativos:

Si no usas Arch Linux, puedes descargar e instalar las herramientas desde sus sitios oficiales.

<!-- * **Docker y Docker Compose:** Descarga [Docker Desktop](https://docs.docker.com/get-docker/), que ya incluye ambas herramientas junto con **Docker Buildx** (necesario para construir las imágenes).
* **Git:** Descárgalo desde [git-scm.com](https://git-scm.com/).
* **Node.js y npm:** Descárgalo desde [nodejs.org](https://nodejs.org/).

--- -->

## Guía de Configuración y Ejecución

### 1. Clonar el repositorio

Abre tu terminal y clona el proyecto:

```bash
git clone "https://github.com/LeandroMurillo/Trabajo-Graduacion.git"
cd Trabajo-Graduacion/Codigo
```

### 2. Configurar Variables de Entorno (`.env`)

Desde la carpeta `Codigo`, copia el ejemplo de desarrollo y completa las credenciales de Firebase:

```bash
cp .env.development.example .env
```

El JSON de `FIREBASE_SERVICE_ACCOUNT_JSON` debe estar minificado en una sola línea. No se deben crear archivos `.env` adicionales dentro de los frontends ni un `config.js` manual.

### 3. Configurar archivo Hosts

El sistema requiere el dominio `trabajo.com` para la gestión de cookies y CORS.

* **Linux:** `sudoedit /etc/hosts`
* **Windows:** Editar `C:\Windows\System32\drivers\etc\hosts` como Administrador.

Añade la siguiente línea al final del archivo:

```text
127.0.0.1   trabajo.com
```

### 4. Levantar los Contenedores

Ejecuta el siguiente comando desde la carpeta `Codigo`:

```bash
sudo docker compose up --build
```

Para producción en AWS, seguir la guía [Codigo/DEPLOY_EC2.md](Codigo/DEPLOY_EC2.md).

## Accesos a los Servicios

| Servicio | URL |
| --- | --- |
| **Postulantes** | `http://trabajo.com/acme` |
| **Administradores** | `http://trabajo.com:5173` |
| **API Backend** | `http://trabajo.com:3000` |
| **Base de Datos** | `localhost:3306` |

## Estructura de Servicios

* **db:** MariaDB (LTS Noble). Ejecuta scripts en `./db/` al iniciar.
* **backend:** Node.js + Express.
* **frontend-postulantes:** React + Vite.
* **frontend-admin:** React + Vite.

### Solución de problemas comunes

<!-- * **Error `failed to resolve import "crypto-js"`:** Asegúrate de haber ejecutado el **Paso 4** y de usar la bandera `-V` al levantar Docker para regenerar los volúmenes de `node_modules`. -->
* **Backend crashea inmediatamente:** Verifica que `FIREBASE_SERVICE_ACCOUNT_JSON` en el `.env` no tenga saltos de línea.

# Verificación de Integridad del Informe

Para garantizar la autenticidad e integridad del archivo `Trabajo Final - Murillo, Herrera - *.pdf`, este ha sido firmado digitalmente utilizando GPG. Puedes seguir los siguientes pasos para verificar que el archivo no ha sido alterado.

## 1. Importar la Clave Pública (opcional)

Primero, necesitas importar la clave pública a tu anillo de claves local.

Copia el siguiente bloque de clave pública y guárdalo en un archivo llamado `firma.asc`, o impórtalo directamente si tu herramienta lo permite.

<details>
<summary><strong>haz clic aquí para ver la Clave Pública PGP</strong></summary>

```text
-----BEGIN PGP PUBLIC KEY BLOCK-----

mDMEaXDp/RYJKwYBBAHaRw8BAQdAy0t2nQ8Pbebzc0pMftH+K5VMVSZfbpMd1DN1
0UAFb960OUNlc2FyIEV6ZXF1aWVsIEhlcnJlcmEgPGNlc2FyLmV6ZXF1aWVsLmhl
cnJlcmFAZ21haWwuY29tPoiQBBMWCgA4FiEEJlSKvFm1W8T0kr2WdCihCkZpFjIF
Amlw6f0CGwMFCwkIBwIGFQoJCAsCBBYCAwECHgECF4AACgkQdCihCkZpFjKcYQEA
ntnA5t7f3O9qvOacQX1QpMXUn37glzfVqGU4mVQczQsA/3XUc5ncIG8zTI1EGadv
AvGqrTYjMX5yeCyI6xP5aEoAuDgEaXDp/RIKKwYBBAGXVQEFAQEHQH+Ukwwor8AO
1NxQxwEtBcYqJH2SDEWLFAVSyRLhlbVeAwEIB4h4BBgWCgAgFiEEJlSKvFm1W8T0
kr2WdCihCkZpFjIFAmlw6f0CGwwACgkQdCihCkZpFjKTzAD+KR/jRlogNudoPUg5
Yo/ATTBLScoUjkLkG+e5ua1qqnUA/jXEof6JBvcw4SiHh4naKtipFXRjxmHWstkM
x2gJ36MD
=GMyy
-----END PGP PUBLIC KEY BLOCK-----
```
</details>

Para importarla desde la terminal:

```bash
gpg --import firma.asc
```

## 2. Verificar la Firma

Una vez importada la clave, asegúrate de tener tanto el archivo original (`Trabajo Final - Murillo, Herrera - *.pdf`) como el archivo de firma (`Trabajo Final - Murillo, Herrera - *.pdf.asc`) en el mismo directorio.

Ejecuta el siguiente comando:

```bash
gpg --verify "Trabajo Final - Murillo, Herrera - *.pdf.asc"
```

## 3. Resultado Esperado

Si el archivo es auténtico, deberías ver una salida similar a esta, confirmando que la firma es **correcta ("Good signature")**:

```text
gpg: Signature made Sun Feb  8 20:23:08 2026 UTC
gpg:                using EDDSA key 26548ABC59B55BC4F492BD967428A10A46691632
gpg: Good signature from "Cesar Ezequiel Herrera <cesar.ezequiel.herrera@gmail.com>" [unknown]
```

> **Nota:** Es normal ver una advertencia sobre que la clave no está certificada por una autoridad de confianza si no has firmado localmente la clave pública. Lo importante es que indique **"Good signature"** y que el ID de la clave coincida con `26548ABC59B55BC4F492BD967428A10A46691632`.
