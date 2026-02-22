#let enlace(url, body) = {
  link(url, [#body ])
}

#pagebreak()
= Codificación

== Código fuente

El código del sistema y de este informe se puede encontrar en el siguiente enlace:

#align(center)[#enlace(
  "https://github.com/LeandroMurillo/Trabajo-Graduacion",
)[https://github.com/LeandroMurillo/Trabajo-Graduacion]]

== Elección del lenguaje de programación

Independientemente del enfoque de la ingeniería de software, la selección del lenguaje de programación impacta en cada fase del ciclo de vida del software, desde la planificación, el análisis, y el diseño, hasta la codificación, las pruebas y el mantenimiento.

Para el desarrollo del sistema se optó por una arquitectura basada en JavaScript/TypeScript en todas las capas de la aplicación (_full-stack_ JS), lo que permite unificar el lenguaje y compartir lógicas de tipado y validación. Para la persistencia de datos se seleccionó MariaDB, un motor de base de datos relacional robusto. En el _backend_ se utiliza el entorno Node.js con el _framework_ Express.js, mientras que para las interfaces de usuario (_frontend_) se emplea la librería React.js.

Aunque la base es JavaScript, el proyecto ha sido desarrollado íntegramente utilizando TypeScript. Este superconjunto añade tipado estático, lo que facilita la detección de errores en tiempo de compilación y mejora la experiencia de desarrollo mediante el autocompletado y la documentación en línea, compilándose finalmente a JavaScript para su ejecución en los navegadores y el servidor.

El detalle de las herramientas seleccionadas se encuentra en el anexo: #enlace(<ElecProg>)[Elección del lenguaje de programación].
