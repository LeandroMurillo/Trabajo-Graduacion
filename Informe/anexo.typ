/*

ANEXO I
Ficha de Presentación del
TRABAJO DE GRADUACIÓN
Instrucciones para llenado.
• Nombre del proyecto: claro y conciso en su descripción. El mismo deberá reflejar certeramente el contenido temático del Trabajo.
• Definición del proyecto tanto individual como en equipo: Se recomienda la generación de proyectos individuales. Si por la complejidad del tema, el proponente considera necesario la participación de dos o más estudiantes, deberá establecerlo claramente y ser avalado por el tutor.
• Objetivos Generales: Descripción elemental de los objetivos perseguidos por el trabajo.
• Objetivos Específicos: Descripción detallada de los objetivos que se pretenden cubrir con el trabajo de graduación.
• Especificaciones: Requisitos a cumplir por el producto terminado. Debe ser amplia y detallada en cuanto a las consignas que se pretende cubrir.
• Conceptos Involucrados: Conceptos teóricos y prácticos involucrados en el tema. Se puede detallar en este ítem la metodología a utilizar, herramientas, etc. Se puede incluir en este apartado en qué asignaturas del plan de estudio se adquirieron estos conceptos.
• Cronograma/Plan de Trabajo: Pasos necesarios con tiempos indicativos para lograr las especificaciones y objetivos del Trabajo. Incluye la duración aproximada del trabajo. La calificación por parte del Jurado del Trabajo de Graduación, puede tener en cuenta la duración estimada con la realmente empleada por los alumnos para la finalización del mismo.
• Lugar de realización del Trabajo y recursos disponibles: Laboratorio(s) o cátedra(s) involucradas necesarias para el desarrollo del trabajo. Si el estudiante necesita equipamiento o materiales no disponibles, deberá indicar de donde obtendrá los fondos para su adquisición.
• Área de Incumbencia: Destaque una o más áreas principales que cubre el trabajo de graduación.
• Duración: Tiempo estimado de duración del trabajo propuesto en meses. Debe destacarse si esta duración es con dedicación parcial o exclusiva.
• Datos del o los Alumnos: Todos los campos son obligatorios.
• Datos del o los Tutores: Aquí se deberá introducir el dato del Tutor y en caso de existir un Tutor Externo o Co-Tutor, se debe detallar quién cumple dicho rol, consignando sus datos completos.

*/

#set page(
  margin: (left: 31.7mm, right: 31.7mm, top: 45.4mm, bottom: 25.4mm),
  header: [#image("header.png", width: 100%)],
  numbering: "1",
)

#set text(font: "Arimo Nerd Font", size: 12pt, lang: "es", hyphenate: false)
#set par(justify: true)
#show math.equation: set text(weight: 400)
#show math.equation: set block(spacing: 0.65em)
#set math.equation(numbering: "(1)")
#set heading(numbering: "1.1")

// Set run-in subheadings, starting at level 4.
#show heading: it => {
  // H1 and H2
  if it.level == 1 {
    pad(
      bottom: 10pt,
      it,
    )
  } else if it.level == 2 {
    pad(
      bottom: 8pt,
      it,
    )
  } else if it.level > 3 {
    text(11pt, weight: "bold", it.body + " ")
  } else {
    it
  }
}

#let enlace(url, body) = {
  link(url, [#body ])
}

#table(
  columns: 1,
  [
    = Título del Trabajo de Graduación:

    Sistema de Gestión de Vacantes de Empleo Multiempresa.

    = Objetivos Generales:

    Desarrollar una plataforma web que permita a las empresas clientes, gestionar sus vacantes de empleo, organizarlas por categorías, manejar la información de los postulantes y realizar un seguimiento de las postulaciones.

    Ofrecer una aplicación única y personalizada para cada empresa, que posibilite a los postulantes registrarse y aplicar a los puestos de empleo, generando la percepción de disponer de una solución exclusiva, diseñada específicamente para satisfacer sus necesidades.

    = Objetivos Específicos:

    - Elaborar una especificación de requisitos formal y completa que defina con precisión las funcionalidades, y restricciones, sirviendo como base para el desarrollo del proyecto.

    - Investigar y evaluar tecnologías y herramientas disponibles en el mercado.

    - Capacitarse en las tecnologías y herramientas elegidas.

    - Codificar el sistema según los estándares de programación adquiridos en la carrera.

    - Probar el sistema, verificando su funcionalidad, rendimiento y cumplimiento de los requisitos establecidos en la especificación.

    - Poner en funcionamiento el sistema, asegurando que esté listo para su uso y cumpla con las expectativas de los usuarios finales.

    #block(height: 25%, width: 11%)
    = Especificaciones del Trabajo de Graduación:

    El proyecto consiste en desarrollar una plataforma de empleos multiempresa que brinde a las empresas clientes, recursos para ofrecer y administrar sus vacantes de empleo. Cada empresa a través de una aplicación _web responsive_ puede gestionar sus vacantes, las categorías a las que estas pertenecen y sus postulantes. Además, la empresa debe tener la ilusión de que este sistema está hecho exclusivamente para ella.

    Debe permitir además a las personas, registrarse como postulante en la empresa, aplicar a una o más vacantes, ver su historial de vacantes y modificar su perfil.

    = Cronograma/Plan de Trabajo:

    - Primera fase:
      - Entrevistas
      - Elección de herramientas
      - Diseño de la base de datos
    - Segunda fase:
      - Página para los postulantes
    - Tercera fase:
      - Página para los administradores
    - Cuarta fase:
      - Documentación e informe

    = Duración Aproximada del Trabajo:

    500 horas.

    //#line(length: 100%, stroke: (paint: black, thickness: 1pt, dash: ("dot", 2pt, 4pt, 2pt)))
    #block(height: 28%, width: 11%)
    = Conceptos Teóricos/Prácticos Involucrados:

    - Metodologías de desarrollo de software
    - Paradigma de orientación a objetos con _UML_
    - Tecnologías Web
    - Arquitectura de software usando MVC
    - Programación orientada a objetos
    - Bases de datos relacionales
    - Acceso a Datos
    - Creación y uso de repositorios web, tal como _Github_
    - Autenticación y autorización para gestión de sesiones
    - Plataformas de comunicación en tiempo real tales como _Google Meet_ y _Discord_
    - _ANSI SQL_
    - _Typst_
    - _Enterprise Architect_
    - _MySQL Workbench_
    - _MariaDB_
    - _JavaScript_
    - _TypeScript_
    - _React_
    - _Node.js_
    - _API_
    - Control de versiones

    = Recursos y ámbito donde se desarrollará (laboratorio, cátedra, etc.):

    El desarrollo del proyecto se realizará en los domicilios de los alumnos y en el laboratorio de la cátedra de Ingeniería de Software.

    = Área de incumbencia del Trabajo (marque todas las que corresponda):

    #grid(
      columns: (1fr, 1fr, 2fr, 1fr),
      grid.cell(
        align: left,
        [#box(stroke: black, width: 1em, height: 1em, baseline: 0.15em) Hardware],
      ),
      grid.cell(
        align: center,
        [#box(stroke: black, width: 1em, height: 1em, baseline: 0.15em, fill: black) Software],
      ),
      grid.cell(
        align: center,
        [#box(stroke: black, width: 1em, height: 1em, baseline: 0.15em) Redes de Computadoras],
      ),
      grid.cell(
        align: right,
        [#box(stroke: black, width: 1em, height: 1em, baseline: 0.15em) Otra Área],
      ),
    )

    //#line(length: 100%, stroke: (paint: black, thickness: 1pt, dash: ("dot", 2pt, 4pt, 2pt)))
    #block(height: 8%, width: 11%)
    *LOS ABAJO FIRMANTES, ACEPTAN CONOCER EL REGLAMENTO VIGENTE PARA LA REALIZACIÓN Y PRESENTACIÓN DEL TRABAJO DE GRADUACIÓN [y que se deben cumplir todos los requisitos, pasos y plazos establecidos en él]*

    = Datos del o los Alumno(s) (Apellidos, Nombres, DNI, Email y Firma)

    Murillo, Leandro, 42221212, #enlace("mailto:leandromurillo00@gmail.com")[leandromurillo00\@gmail.com]
    #align(right)[#image(
        "firmamurillo.jpg",
        height: 15%,
      )]

    Herrera, Cesar Ezequiel, 38737903, #enlace("mailto:cesar.ezequiel.herrera@gmail.com")[cesar.ezequiel.herrera\@gmail.com]
    #align(right)[#image(
        "firmaherrera.jpg",
        height: 10%,
      )]

    = Datos del o los tutores(s) (Apellidos, Nombres, Email y Firma) – Rol (si corresponde)

    Ing. Odstrcil, Maximiliano, #enlace("mailto:modstrcil@herrera.unt.edu.ar")[modstrcil\@herrera.unt.edu.ar]

    #block(height: 25%, width: 11%)],
)

#align(center)[
  San Miguel de Tucumán,
  #underline(stroke: (dash: "loosely-dotted"), offset: 4pt)[ 20 ]
  de
  #underline(stroke: (dash: "loosely-dotted"), offset: 4pt)[ febrero ]
  de
  #underline(stroke: (dash: "loosely-dotted"), offset: 4pt)[ 2025. ]]
