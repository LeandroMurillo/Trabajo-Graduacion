# Trabajo de Graduación

[Leandro Murillo](mailto:leandromurillo00@gmail.com)
42221212

[César Ezequiel Herrera](mailto:cesar.ezequiel.herrera@gmail.com)
38737903

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
gpg --verify "Trabajo Final - Murillo, Herrera - *.pdf.asc" "Trabajo Final - Murillo, Herrera - *.pdf"

```

## 3. Resultado Esperado

Si el archivo es auténtico, deberías ver una salida similar a esta, confirmando que la firma es **correcta ("Good signature")**:

```text
gpg: Signature made Sun Feb  8 20:23:08 2026 UTC
gpg:                using EDDSA key 26548ABC59B55BC4F492BD967428A10A46691632
gpg: Good signature from "Cesar Ezequiel Herrera <cesar.ezequiel.herrera@gmail.com>" [unknown]

```

> **Nota:** Es normal ver una advertencia sobre que la clave no está certificada por una autoridad de confianza si no has firmado localmente la clave pública. Lo importante es que indique **"Good signature"** y que el ID de la clave coincida con `26548ABC59B55BC4F492BD967428A10A46691632`.
