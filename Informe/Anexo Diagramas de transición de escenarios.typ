#import "@preview/grayness:0.5.0": *
#let enlace(url, body) = {
  link(url, [#body ])
}

== Diagramas de transición de escenarios <DiagEsc>

=== Rol Superadministrador

#figure(
  rect(
    width: 120%,
    stroke: 0.5pt + rgb("#333333"),
    radius: 4pt,
    outset: 0pt,
    image("TransiciónEscenarios/Superadmin.drawio.png"),
  ),
  caption: [Diagrama de transición: Rol Superadministrador],
)

#pagebreak()
=== Rol Administrador

#figure(
  rect(
    width: 120%,
    stroke: 0.5pt + rgb("#333333"),
    radius: 4pt,
    outset: 0pt,
    image("TransiciónEscenarios/Administrador.drawio.png"),
  ),
  caption: [Diagrama de transición: Rol Administrador],
)

#let celda-diagonal(abajo, arriba) = table.cell(inset: 0pt)[
  #block(width: 100%, height: 30pt, {
    // Ajustá el height según necesites
    // Texto arriba a la derecha
    place(top + right, dx: -5pt, dy: 5pt)[#arriba]
    // Texto abajo a la izquierda
    place(bottom + left, dx: 5pt, dy: -5pt)[#abajo]
    // La línea diagonal
    line(start: (0%, 0%), end: (100%, 100%), stroke: 1pt)
  })
]

== Tablas de transición de escenarios

#pagebreak()
#align(right)[
  #rotate(90deg, reflow: true)[
    #figure(
      caption: [Rol Superadministrador],
      {
        // Ponemos en negrita la primera columna (x: 0) y la primera fila (y: 0)
        show table.cell.where(x: 0): set text(weight: "bold")
        show table.cell.where(y: 0): set text(weight: "bold")

        set text(size: 0.7em)
        set par(justify: false)

        table(
          columns: (2fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr),
          rows: 1.5cm,
          inset: 10pt,
          align: horizon,
          stroke: (x, y) => {
            // 1. Definimos las líneas horizontales base para toda la tabla
            let s = (top: 1pt, bottom: 1pt)

            // 2. La "L" de encabezados (Fila 0 o Columna 0) lleva borde completo
            // Esto asegura el separador entre la primera columna y el resto.
            if x == 0 or y == 0 { return 1pt }

            // 3. Borde externo derecho (x == última columna, que es 3)
            if x == 11 { s.insert("right", 1pt) }

            return s
          },
          fill: (x, y) => {
            if x == 0 or y == 0 {
              gray.lighten(60%) // Gris para encabezado y primera columna
            } else if calc.odd(x) {
              white // Filas impares
            } else {
              gray.lighten(90%)
            }
          },

          [#celda-diagonal([Desde], [Hasta])],
          [#link(<SU_01_00>)[SU_01_00]],
          [#link(<SU_02_00>)[SU_02_00]],
          [#link(<SU_03_00>)[SU_03_00]],
          [#link(<SU_04_00>)[SU_04_00]],
          [#link(<SU_05_00>)[SU_05_00]],
          [#link(<SU_06_00>)[SU_06_00]],
          [#link(<SU_07_00>)[SU_07_00]],
          [#link(<SU_08_00>)[SU_08_00]],
          [#link(<SU_09_00>)[SU_09_00]],
          [#link(<SU_10_00>)[SU_10_00]],
          [#link(<SU_11_00>)[SU_11_00]],

          [],
          [Ingresa a la plataforma],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],

          [#enlace(<SU_01_00>)[SU_01_00 \ Página de iniciar sesión]],
          [        ],
          [        ],
          [SU_01_03],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],

          [#enlace(<SU_02_00>)[SU_02_00 \ Menú lateral]],
          [        ],
          [        ],
          [SU_02_04],
          [        ],
          [        ],
          [        ],
          [SU_02_05],
          [        ],
          [        ],
          [        ],
          [SU_02_06],

          [#enlace(<SU_03_00>)[SU_03_00 \ Listado de empresas]],
          [        ],
          [SU_03_01],
          [        ],
          [SU_03_08],
          [SU_03_11],
          [SU_03_12],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],

          [#enlace(<SU_04_00>)[SU_04_00 \ Añadir empresa]],
          [        ],
          [SU_04_01],
          [SU_04_09],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],

          [#enlace(<SU_05_00>)[SU_05_00 \ Editar empresa]],
          [        ],
          [SU_05_01],
          [SU_05_09],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],

          [#enlace(<SU_06_00>)[SU_06_00 \ Confirmar borrar empresa]],
          [        ],
          [        ],
          [SU_06_01
           SU_06_02],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],

          [#enlace(<SU_07_00>)[SU_07_00 \ Listado de administradores]],
          [        ],
          [SU_07_01],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [SU_07_08],
          [SU_07_10],
          [SU_07_11],
          [        ],
        )
      },
    )
  ]
]

#align(right)[
  #rotate(90deg, reflow: true)[
    #figure(
      caption: [Rol Superadministrador],
      {
        // Ponemos en negrita la primera columna (x: 0) y la primera fila (y: 0)
        show table.cell.where(x: 0): set text(weight: "bold")
        show table.cell.where(y: 0): set text(weight: "bold")

        set text(size: 0.7em)
        set par(justify: false)

        table(
          columns: (2fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr),
          rows: 1.5cm,
          inset: 10pt,
          align: horizon,
          stroke: (x, y) => {
            // 1. Definimos las líneas horizontales base para toda la tabla
            let s = (top: 1pt, bottom: 1pt)

            // 2. La "L" de encabezados (Fila 0 o Columna 0) lleva borde completo
            // Esto asegura el separador entre la primera columna y el resto.
            if x == 0 or y == 0 { return 1pt }

            // 3. Borde externo derecho (x == última columna, que es 3)
            if x == 11 { s.insert("right", 1pt) }

            return s
          },
          fill: (x, y) => {
            if x == 0 or y == 0 {
              gray.lighten(60%) // Gris para encabezado y primera columna
            } else if calc.odd(x) {
              white // Filas impares
            } else {
              gray.lighten(90%)
            }
          },

          [#celda-diagonal([Desde], [Hasta])],
          [#link(<SU_01_00>)[SU_01_00]],
          [#link(<SU_02_00>)[SU_02_00]],
          [#link(<SU_03_00>)[SU_03_00]],
          [#link(<SU_04_00>)[SU_04_00]],
          [#link(<SU_05_00>)[SU_05_00]],
          [#link(<SU_06_00>)[SU_06_00]],
          [#link(<SU_07_00>)[SU_07_00]],
          [#link(<SU_08_00>)[SU_08_00]],
          [#link(<SU_09_00>)[SU_09_00]],
          [#link(<SU_10_00>)[SU_10_00]],
          [#link(<SU_11_00>)[SU_11_00]],

          [#enlace(<SU_08_00>)[SU_08_00 \ Añadir administrador]],
          [        ],
          [SU_08_01],
          [        ],
          [        ],
          [        ],
          [        ],
          [SU_08_11],
          [        ],
          [        ],
          [        ],
          [        ],

          [#enlace(<SU_09_00>)[SU_09_00 \ Editar administrador]],
          [        ],
          [SU_09_01],
          [        ],
          [        ],
          [        ],
          [        ],
          [SU_09_11],
          [        ],
          [        ],
          [        ],
          [        ],

          [#enlace(<SU_10_00>)[SU_10_00 \ Confirmar borrar administrador]],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [SU_10_01
           SU_10_02],
          [        ],
          [        ],
          [        ],
          [        ],

          [#enlace(<SU_11_00>)[SU_11_00 \ Listado de cuotas]],
          [        ],
          [SU_11_01],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
        )
      },
    )
  ]
]

// === Rol Administrador

#align(right)[
  #rotate(90deg, reflow: true)[
    #figure(
      caption: [Rol Administrador],
      {
        // Ponemos en negrita la primera columna (x: 0) y la primera fila (y: 0)
        show table.cell.where(x: 0): set text(weight: "bold")
        show table.cell.where(y: 0): set text(weight: "bold")

        set text(size: 0.5em)
        set par(justify: false)

        table(
          columns: (1.6fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr),
          rows: 1.4cm,
          inset: 10pt,
          align: horizon,
          stroke: (x, y) => {
            // 1. Definimos las líneas horizontales base para toda la tabla
            let s = (top: 1pt, bottom: 1pt)

            // 2. La "L" de encabezados (Fila 0 o Columna 0) lleva borde completo
            // Esto asegura el separador entre la primera columna y el resto.
            if x == 0 or y == 0 { return 1pt }

            // 3. Borde externo derecho (x == última columna, que es 3)
            if x == 16 { s.insert("right", 1pt) }

            return s
          },
          fill: (x, y) => {
            if x == 0 or y == 0 {
              gray.lighten(60%) // Gris para encabezado y primera columna
            } else if calc.odd(x) {
              white // Filas impares
            } else {
              gray.lighten(90%)
            }
          },

          [#celda-diagonal([Desde], [Hasta])],
          [#link(<AD_01_00>)[AD_01_00]],
          [#link(<AD_02_00>)[AD_02_00]],
          [#link(<AD_03_00>)[AD_03_00]],
          [#link(<AD_04_00>)[AD_04_00]],
          [#link(<AD_05_00>)[AD_05_00]],
          [#link(<AD_06_00>)[AD_06_00]],
          [#link(<AD_07_00>)[AD_07_00]],
          [#link(<AD_08_00>)[AD_08_00]],
          [#link(<AD_09_00>)[AD_09_00]],
          [#link(<AD_10_00>)[AD_10_00]],
          [#link(<AD_11_00>)[AD_11_00]],
          [#link(<AD_12_00>)[AD_12_00]],
          [#link(<AD_13_00>)[AD_13_00]],
          [#link(<AD_14_00>)[AD_14_00]],
          [#link(<AD_15_00>)[AD_15_00]],
          [#link(<AD_16_00>)[AD_16_00]],

          [],
          [Ingresa a la plataforma],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],

          [#enlace(<AD_01_00>)[AD_01_00 \ Página de iniciar sesión]],
          [        ],
          [        ],
          [AD_01_03],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],

          [#enlace(<AD_02_00>)[AD_02_00 \ Menú lateral]],
          [        ],
          [        ],
          [AD_02_04],
          [        ],
          [        ],
          [        ],
          [        ],
          [AD_02_05],
          [        ],
          [        ],
          [        ],
          [        ],
          [AD_02_06],
          [        ],
          [AD_02_07],
          [        ],

          [#enlace(<AD_03_00>)[AD_03_00 \ Listado de vacantes]],
          [        ],
          [AD_03_01],
          [        ],
          [AD_03_10],
          [AD_03_09],
          [AD_03_11],
          [AD_03_12],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],

          [#enlace(<AD_04_00>)[AD_04_00 \ Listado de postulaciones de la vacante]],
          [        ],
          [AD_04_01],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],

          [#enlace(<AD_05_00>)[AD_05_00 \ Añadir vacante]],
          [        ],
          [AD_05_01],
          [AD_05_16
           AD_05_17],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],

          [#enlace(<AD_06_00>)[AD_06_00 \ Editar vacante]],
          [        ],
          [AD_06_01],
          [AD_06_17
           AD_06_18],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],

          [#enlace(<AD_07_00>)[AD_07_00 \ Confirmar borrar vacante]],
          [        ],
          [        ],
          [AD_07_01
           AD_07_02],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],

          [#enlace(<AD_08_00>)[AD_08_00 \ Listado de categorías]],
          [        ],
          [AD_08_01],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [AD_08_10],
          [AD_08_09],
          [AD_08_12],
          [AD_08_13],
          [        ],
          [        ],
          [        ],
          [        ],
        )
      },
    )
  ]
]

#align(right)[
  #rotate(90deg, reflow: true)[
    #figure(
      caption: [Rol Administrador],
      {
        // Ponemos en negrita la primera columna (x: 0) y la primera fila (y: 0)
        show table.cell.where(x: 0): set text(weight: "bold")
        show table.cell.where(y: 0): set text(weight: "bold")

        set text(size: 0.5em)
        set par(justify: false)

        table(
          columns: (1.6fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr),
          rows: 1.5cm,
          inset: 10pt,
          align: horizon,
          stroke: (x, y) => {
            // 1. Definimos las líneas horizontales base para toda la tabla
            let s = (top: 1pt, bottom: 1pt)

            // 2. La "L" de encabezados (Fila 0 o Columna 0) lleva borde completo
            // Esto asegura el separador entre la primera columna y el resto.
            if x == 0 or y == 0 { return 1pt }

            // 3. Borde externo derecho (x == última columna, que es 3)
            if x == 16 { s.insert("right", 1pt) }

            return s
          },
          fill: (x, y) => {
            if x == 0 or y == 0 {
              gray.lighten(60%) // Gris para encabezado y primera columna
            } else if calc.odd(x) {
              white // Filas impares
            } else {
              gray.lighten(90%)
            }
          },

          [#celda-diagonal([Desde], [Hasta])],
          [#link(<AD_01_00>)[AD_01_00]],
          [#link(<AD_02_00>)[AD_02_00]],
          [#link(<AD_03_00>)[AD_03_00]],
          [#link(<AD_04_00>)[AD_04_00]],
          [#link(<AD_05_00>)[AD_05_00]],
          [#link(<AD_06_00>)[AD_06_00]],
          [#link(<AD_07_00>)[AD_07_00]],
          [#link(<AD_08_00>)[AD_08_00]],
          [#link(<AD_09_00>)[AD_09_00]],
          [#link(<AD_10_00>)[AD_10_00]],
          [#link(<AD_11_00>)[AD_11_00]],
          [#link(<AD_12_00>)[AD_12_00]],
          [#link(<AD_13_00>)[AD_13_00]],
          [#link(<AD_14_00>)[AD_14_00]],
          [#link(<AD_15_00>)[AD_15_00]],
          [#link(<AD_16_00>)[AD_16_00]],

          [#enlace(<AD_09_00>)[AD_09_00 \ Listado de vacantes de la categoría]],
          [        ],
          [AD_09_01],
          [        ],
          [AD_09_10],
          [AD_09_09],
          [AD_09_11],
          [AD_09_12],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],

          [#enlace(<AD_10_00>)[AD_10_00 \ Añadir categoría]],
          [        ],
          [AD_10_01],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [AD_10_10],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],

          [#enlace(<AD_11_00>)[AD_11_00 \ Editar categoría]],
          [        ],
          [AD_11_01],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [AD_11_10],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],

          [#enlace(<AD_12_00>)[AD_12_00 \ Confirmar borrar categoría]],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [AD_12_01
           AD_12_02],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],

          [#enlace(<AD_13_00>)[AD_13_00 \ Listado de postulantes]],
          [        ],
          [AD_13_01],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [AD_13_09],
          [        ],
          [        ],

          [#enlace(<AD_14_00>)[AD_14_00 \ Listado de postulaciones del postulante]],
          [        ],
          [AD_14_01],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],

          [#enlace(<AD_15_00>)[AD_15_00 \ Editar estilos de empresa]],
          [        ],
          [AD_15_01],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [AD_15_10],

          [#enlace(<AD_16_00>)[AD_16_00 \ Previsualizar estilos de empresa]],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [AD_16_01
           AD_16_02
           AD_16_03],
          [        ],
        )
      },
    )
  ]
]

== Descripción de escenarios <DescEsc>

=== Rol Superadministrador

#figure(
  box(
    width: 60%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    /* image-crop(
      read("Capturas/trabajo.com_5173_sign-in(iPad Air).png", encoding: none),
      crop-width: 2360,
      crop-height: 1000,
      crop-start-x: 0,
      crop-start-y: 695,
    ), */
    image("Capturas/trabajo.com_5173_sign-in(iPad Air).png"),
  ),
  caption: [Escenario: SU_01_00 - Página de Iniciar Sesión],
) <SU_01_00>

#linebreak()
Este escenario es el punto de entrada para el Superadministrador, quien posee los privilegios más elevados dentro del sistema. Desde aquí, debe autenticarse para acceder al panel de gestión global de SGVac.

Se muestra "Panel de administración" para identificar a la plataforma. Debajo, se presenta el formulario de credenciales con las etiquetas de los campos requeridos: Correo electrónico (SU_01_01) y Contraseña (SU_01_02).

Una vez completados los datos, pulsa el botón "Iniciar Sesión" (SU_01_03). El sistema valida las credenciales contra el registro de superadministradores y, de ser correctas, redirige al Panel de Control Global.

#figure(
  box(
    width: 60%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    /* image-crop(
      read("Capturas/trabajo.com_5173_sign-in(iPad Air) (17).png", encoding: none),
      crop-width: 2360,
      crop-height: 1000,
      crop-start-x: 0,
      crop-start-y: 695,
    ), */
    image("Capturas/trabajo.com_5173_sign-in(iPad Air) (17).png"),
  ),
  caption: [Escenario: SU_02_00 - Menú lateral],
) <SU_02_00>

#linebreak()
El menú lateral es el eje de navegación que permite administrar la plataforma a gran escala. Diseñado para que sea intuitivo y siempre esté disponible, facilitando el salto entre la gestión de clientes y la supervisión financiera.

En la parte superior, contiene los controles de sesión y visualización:

Botón de Menú (SU_02_01): Un ícono de "hamburguesa" que permite contraer o expandir la barra lateral según necesitemos más espacio en el área de trabajo principal.

Identificador del Panel (SU_02_02): El título "Panel Superadmin" que confirma en todo momento que se está operando con los permisos más altos del sistema.

Menú de Usuario (SU_02_03): Un acceso para cerrar la sesión de forma segura.

Dentro de la Barra Lateral, se organizan los accesos directos a las funcionalidades clave:

Empresas (SU_02_04): El acceso directo al listado de organizaciones. Desde aquí se controlan qué empresas tienen permiso para usar la plataforma.

Administradores (SU_02_05): Redirige al panel de gestión de usuarios administradores, permitiendo crear o editar a los responsables de cada empresa.

Cuotas (SU_02_06): El módulo donde se supervisa el estado de los pagos y suscripciones de todas las entidades clientes.

#pagebreak()
#figure(
  box(
    width: 60%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    /* image-crop(
      read("Capturas/trabajo.com_5173_sign-in(iPad Air) (1).png", encoding: none),
      crop-width: 2360,
      crop-height: 2000,
      crop-start-x: 0,
      crop-start-y: 0,
    ), */
    image("Capturas/trabajo.com_5173_sign-in(iPad Air) (1).png"),
  ),
  caption: [Escenario: SU_03_00 - Listado de empresas],
) <SU_03_00>

#linebreak()
Este escenario constituye el panel principal del Superadministrador para la gestión global de las organizaciones registradas en SGVac. Permite visualizar de forma centralizada todas las empresas que utilizan la plataforma y acceder a las funciones de alta, baja y modificación de las mismas.

En la parte superior se observa el título del módulo "Todas las empresas", acompañado del botón "Añadir" (SU_03_08), el cual permite acceder al formulario de creación de una nueva organización.

El cuerpo central del escenario presenta una tabla con el listado de empresas (SU_03_09).

Dentro de la tabla, el Superadministrador dispone del botón Editar (SU_03_11) para modificar los datos de la empresa, el botón Borrar (SU_03_12) para eliminar una empresa y el switch "Activada" (SU_03_10) para activar o dar de baja una empresa.

#pagebreak()
#figure(
  box(
    width: 60%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    /* image-crop(
      read("Capturas/trabajo.com_5173_sign-in(iPad Air) (3).png", encoding: none),
      crop-width: 2360,
      crop-height: 800,
      crop-start-x: 0,
      crop-start-y: 0,
    ), */
    image("Capturas/trabajo.com_5173_sign-in(iPad Air) (3).png"),
  ),
  caption: [Escenario: SU_04_00 - Añadir empresa],
) <SU_04_00>

#linebreak()
Este escenario presenta el formulario de registro necesario para incorporar una nueva organización cliente al sistema SGVac. Se accede a esta interfaz tras pulsar el botón "Añadir" en el listado global de empresas.

En la parte superior se observa el título del formulario "Nueva Empresa". La interfaz está organizada para facilitar la carga de los datos:

Identificación: Incluye los campos para ingresar el Nombre de la empresa (SU_04_07) y el slug (SU_04_08).

Finalmente, el usuario dispone del botón "Crear" (SU_04_09) para confirmar la operación y persistir los datos.

#pagebreak()
#figure(
  box(
    width: 60%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    /* image-crop(
      read("Capturas/trabajo.com_5173_sign-in(iPad Air) (2).png", encoding: none),
      crop-width: 2360,
      crop-height: 800,
      crop-start-x: 0,
      crop-start-y: 0,
    ), */
    image("Capturas/trabajo.com_5173_sign-in(iPad Air) (2).png"),
  ),
  caption: [Escenario: SU_05_00 - Editar empresa],
) <SU_05_00>

#linebreak()
Este escenario permite al Superadministrador modificar la información de una organización ya registrada en el sistema. Se accede a esta interfaz tras pulsar el botón de edición en la fila correspondiente del listado de empresas.

Al ingresar, el sistema recupera automáticamente los datos desde la base de datos y los precarga en el formulario para su edición. Se observa el título "Editar empresa" en la parte superior. El formulario presenta los campos habilitados para su actualización:

Permite modificar el Nombre (SU_05_07) y el slug (SU_05_08) de la entidad.

Para confirmar las modificaciones, el usuario pulsa el botón "Editar" (SU_05_09). El sistema valida que los datos cumplan con el esquema requerido antes de actualizar el registro.

#pagebreak()
#figure(
  box(
    width: 60%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    /* image-crop(
      read("Capturas/trabajo.com_5173_admin_empresas(iPad Air).png", encoding: none),
      crop-width: 2360,
      crop-height: 2000,
      crop-start-x: 0,
      crop-start-y: 0,
    ), */
    image("Capturas/trabajo.com_5173_admin_empresas(iPad Air).png"),
  ),
  caption: [Escenario: SU_06_00 - Confirmar borrar empresa],
) <SU_06_00>

#linebreak()
Este escenario consiste en una ventana emergente (modal) que se activa cuando, desde el listado general de empresas, se decide prescindir de los servicios de una organización específica. Su objetivo principal es actuar como una red de seguridad, asegurando que la acción sea intencional.

En el centro de la interfaz, se observan los siguientes elementos:

Título de Advertencia: Un encabezado claro que indica la naturaleza de la acción.

Botón de "Borrar" (SU_06_02): Al pulsarlo, el sistema ejecuta la petición de borrado al backend. Una vez procesada la baja, el sistema redirige automáticamente al listado actualizado y muestra una notificación de éxito.

Botón de Cancelar (SU_06_01): Permite cerrar el modal sin realizar ninguna modificación, garantizando que los datos de la empresa permanezcan intactos en el sistema.

#pagebreak()
#figure(
  box(
    width: 60%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    /* ge-crop(
      read("Capturas/trabajo.com_5173_sign-in(iPad Air) (4).png", encoding: none),
      crop-width: 2360,
      crop-height: 2000,
      crop-start-x: 0,
      crop-start-y: 0,
    ), */
    image("Capturas/trabajo.com_5173_sign-in(iPad Air) (4).png"),
  ),
  caption: [Escenario: SU_07_00 - Listado de administradores],
) <SU_07_00>

#linebreak()
Este escenario representa el panel central desde el cual los Superadministradores controlan las cuentas de los administradores de todas las empresas registradas en el sistema. Es una herramienta clave para asegurar que cada organización tenga a su personal a cargo debidamente habilitado.

En la parte superior, se observa el título del módulo "Todos los administradores", seguido del botón "Añadir" (SU_07_08). Este botón permite acceder al formulario para dar de alta a un nuevo encargado de empresa.

El cuerpo principal del escenario contiene una tabla informativa (SU_07_09) donde listamos los datos más relevantes de cada administrador:

Correo electrónico: El email registrado que funciona como nombre de usuario para el inicio de sesión.

Empresa: Indica a qué organización pertenece el administrador, permitiéndonos verificar rápidamente su ámbito de acción.

Interactuar con el botón Editar (SU_07_10) redirige al escenario editar administrador y el botón Borrar (SU_07_11) redirige a borrar administrador.

#pagebreak()
#figure(
  box(
    width: 60%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    /* image-crop(
      read("Capturas/trabajo.com_5173_sign-in(iPad Air) (5).png", encoding: none),
      crop-width: 2360,
      crop-height: 1000,
      crop-start-x: 0,
      crop-start-y: 0,
    ), */
    image("Capturas/trabajo.com_5173_sign-in(iPad Air) (5).png"),
  ),
  caption: [Escenario: SU_08_00 - Añadir administrador],
) <SU_08_00>

#linebreak()
Este escenario presenta el formulario para dar de alta a un nuevo administrador en la plataforma. Es un paso fundamental después de haber registrado una empresa, ya que cada organización requiere de un responsable para gestionar sus vacantes y postulaciones de manera autónoma.

En la parte superior se observa el título del formulario "Nuevo administrador".

El campo Correo electrónico (SU_08_07) es obligatorio, ya que funcionará como el identificador único para que el administrador acceda a su panel.

Incluye un selector de Empresa (SU_08_08), el cual permite asociar este nuevo administrador con una de las organizaciones que cargada previamente en el sistema.

Para completar el alta, pulsa el botón Guardar (SU_08_11). En ese momento, el sistema valida que los datos cumplan con el esquema requerido antes de persistirlos.

#pagebreak()
#figure(
  box(
    width: 60%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    /* image-crop(
      read("Capturas/trabajo.com_5173_admin_administradores_3_edit(iPad Air).png", encoding: none),
      crop-width: 2360,
      crop-height: 1000,
      crop-start-x: 0,
      crop-start-y: 0,
    ), */
    image("Capturas/trabajo.com_5173_admin_administradores_3_edit(iPad Air).png"),
  ),
  caption: [Escenario: SU_09_00 - Editar administrador],
) <SU_09_00>

#linebreak()
Este escenario permite al Superadministrador modificar los datos de acceso y la vinculación corporativa de un administrador existente. Es la herramienta que se utiliza para actualizar correos, reasignar responsables a diferentes empresas o realizar un reseteo de seguridad en las credenciales.

Al entrar a esta vista, el sistema busca los datos en la base de datos y los precarga en el formulario. Cuenta con los siguientes elementos operativos:

Correo (SU_09_07): El identificador único del administrador. Permite modificar el email con el que el administrador se autentica en la plataforma.

Empresa (SU_09_08): Un selector que permite cambiar la organización a la que el administrador está asignado. // , permitiendo una gestión flexible de los recursos humanos de nuestros clientes.

Contraseña (SU_09_09): Campo para ingresar una nueva clave de seguridad si el administrador necesita restablecerla.

Confirmar contraseña (SU_09_10): Un mecanismo de seguridad esencial. Como se ve en la interfaz, se implementa una validación dinámica que lanza un mensaje de error si los valores ingresados no coinciden, evitando errores de tipeo que bloqueen al administrador.

Para confirmar la actualización de los datos, pulsamos el botón "Editar" (SU_09_11). Una vez procesado el cambio en el backend, el sistema vuelve al listado general de administradores con el registro actualizado.

#pagebreak()
#figure(
  box(
    width: 60%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    /* image-crop(
      read("Capturas/trabajo.com_5173_admin_administradores(iPad Air).png", encoding: none),
      crop-width: 2360,
      crop-height: 1500,
      crop-start-x: 0,
      crop-start-y: 0,
    ), */
    image("Capturas/trabajo.com_5173_admin_administradores(iPad Air).png"),
  ),
  caption: [Escenario: SU_10_00 - Confirmar borrar administrador],
) <SU_10_00>

#linebreak()
Este escenario consiste en un cuadro de diálogo de confirmación que se superpone a la vista general de "Todos los administradores". Se activa cuando se pulsa el ícono de la papelera en la fila de un administrador específico dentro de la tabla de gestión.

La interfaz del modal es directa y está diseñada para captar la atención del Superadministrador:

Encabezado de Advertencia: Muestra el título "Confirmar borrado" para alertar sobre la naturaleza irreversible de la acción.

// Mensaje de Validación: Presenta la pregunta "¿Seguro que querés borrar este elemento?" (SU_10_01), asegurando que no hayamos presionado el botón por accidente durante la navegación.

Botón "Cancelar" (SU_10_01): Permite cerrar la ventana emergente de inmediato, regresando al listado sin alterar el estado del administrador.

Botón "Borrar" (SU_10_02): Al confirmarlo, el sistema envía la solicitud de baja al backend. Esto elimina el acceso del administrador a la plataforma y actualiza la tabla de administradores de forma dinámica.

Al finalizar la operación, el modal se cierra automáticamente y el sistema muestra una notificación confirmando que el registro ha sido removido con éxito.

#pagebreak()
#figure(
  box(
    width: 60%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    /* image-crop(
      read("Capturas/trabajo.com_5173_sign-in(iPad Air) (6).png", encoding: none),
      crop-width: 2360,
      crop-height: 1500,
      crop-start-x: 0,
      crop-start-y: 0,
    ), */
    image("Capturas/trabajo.com_5173_sign-in(iPad Air) (6).png"),
  ),
  caption: [Escenario: SU_11_00 - Listado de cuotas],
) <SU_11_00>

#linebreak()
Este escenario es la herramienta que utilizan los Superadministradores para llevar un control centralizado de los pagos realizados por las empresas clientes. Se puede supervisar de manera ágil que todas las organizaciones estén al día con sus abonos para garantizar la continuidad del servicio.

En la parte superior, se observa el título del módulo "Cuotas". La interfaz principal consiste en una tabla (SU_11_07), que extrae la información directamente de la base de datos y presenta los datos financieros de forma estructurada:

Empresa: Indica el nombre de la organización responsable del pago.

Monto: Muestra el valor económico abonado por la empresa en esa cuota específica.

Fecha de Pago: Registra el día y la hora en que se efectuó la transacción, lo que permite verificar el cumplimiento de los plazos de vencimiento.

#pagebreak()
=== Rol Administrador

#figure(
  box(
    width: 60%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    /* image-crop(
      read("Capturas/trabajo.com_5173_sign-in(iPad Air).png", encoding: none),
      crop-width: 2360,
      crop-height: 1000,
      crop-start-x: 0,
      crop-start-y: 695,
    ), */
    image("Capturas/trabajo.com_5173_sign-in(iPad Air).png"),
  ),
  caption: [Escenario: AD_01_00 - Página de Iniciar Sesión],
) <AD_01_00>

#linebreak()
Este escenario es el punto de entrada para un administrador, quien posee los privilegios más elevados dentro de su empresa. Desde aquí, debe autenticarse para acceder al panel de gestión de su empresa.

Se muestra "Panel de administración" para identificar a la plataforma. Debajo, se presenta el formulario de credenciales con las etiquetas de los campos requeridos: Correo electrónico (AD_01_01) y Contraseña (AD_01_02).

Una vez completados los datos, pulsa el botón "Iniciar Sesión" (AD_01_03). El sistema valida las credenciales contra el registro de administradores y, de ser correctas, redirige al Panel de control de su empresa.

#figure(
  box(
    width: 60%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    /* image-crop(
      read("Capturas/Copia de trabajo.com_5173_sign-in(iPad Air) (7).png", encoding: none),
      crop-width: 2360,
      crop-height: 1000,
      crop-start-x: 0,
      crop-start-y: 695,
    ), */
    image("Capturas/Copia de trabajo.com_5173_sign-in(iPad Air) (7).png"),
  ),
  caption: [Escenario: AD_02_00 - Menú lateral],
) <AD_02_00>

#linebreak()
El menú lateral es la herramienta de navegación constante. Está diseñado para ser intuitivo y permitir un acceso directo a todas las funcionalidades que se necesitan para llevar adelante los procesos de selección.

En la Barra Superior, cuenta con controles de contexto y usuario:

Botón de Menú (AD_02_01): El ícono de "hamburguesa" que permite expandir o contraer la barra lateral para ganar espacio visual en las tablas de datos.

Mensaje de Bienvenida (AD_02_02): Confirma nuestra identidad y la empresa que se está gestionando.

Menú de Usuario (AD_02_03): El acceso directo para cerrar la sesión de forma segura.

En la Barra Lateral de Navegación, se organiza el acceso a los distintos módulos del sistema:

Vacantes (AD_02_04): El acceso directo al listado global de búsquedas (AD_03_00), donde se crean y editan las ofertas laborales.

Categorías (AD_02_05): Redirige a la gestión de rubros o áreas de la empresa.

Postulantes (AD_02_06): El enlace a la base de datos de candidatos registrados que han mostrado interés en la organización.

Estilos (AD_02_07): El acceso al panel de personalización visual, donde se definen los colores corporativos que verán los postulantes en el portal público.

#pagebreak()
#figure(
  box(
    width: 60%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    /* image-crop(
      read("Capturas/trabajo.com_5173_sign-in(iPad Air) (7).png", encoding: none),
      crop-width: 2360,
      crop-height: 1600,
      crop-start-x: 0,
      crop-start-y: 0,
    ), */
    image("Capturas/trabajo.com_5173_sign-in(iPad Air) (7).png"),
  ),
  caption: [Escenario: AD_03_00 - Listado de vacantes],
) <AD_03_00>

#linebreak()
Este escenario es el panel central donde los administradores de la empresa, gestionan todas las búsquedas laborales activas y pasadas. Es la herramienta principal para supervisar el estado de las ofertas y organizar el flujo de reclutamiento.

En la parte superior, se muestra el título del módulo "Todas las vacantes". Debajo, está con el botón "Añadir" (AD_03_09), que permite acceder al formulario para dar de alta una nueva búsqueda en el sistema. También disponemos de un botón para actualizar los datos (AD_03_08).

El cuerpo del escenario lo compone una tabla detallada (AD_03_10) donde listamos la información clave de cada oferta:

Título: Indica el nombre del puesto.

Categoría: Muestra el área funcional a la que pertenece la vacante, facilitando la organización interna.

Fecha de Publicación: Señala cuando se estableció para recibir postulaciones.

Fecha de Cierre: Señala el plazo límite que se estableció para recibir postulaciones.

Estado: Una etiqueta que indica si la vacante está "Publicada", "Cerrada" o en "Borrador".

En la columna de acciones, se tiene acceso directo a las herramientas de edición: el botón de Editar (AD_03_11), para ajustar detalles de la oferta, y el botón de Eliminar (AD_03_12), que se utiliza para realizar el borrado si la vacante ya no es necesaria en el registro activo.

#pagebreak()
#figure(
  box(
    width: 60%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    /* image-crop(
      read("Capturas/trabajo.com_5173_sign-in(iPad Air) (9).png", encoding: none),
      crop-width: 2360,
      crop-height: 2000,
      crop-start-x: 0,
      crop-start-y: 0,
    ), */
    image("Capturas/trabajo.com_5173_sign-in(iPad Air) (9).png"),
  ),
  caption: [Escenario: AD_04_00 - Listado de postulaciones de la vacante],
) <AD_04_00>

#linebreak()
Este escenario permite visualizar y gestionar a todos los candidatos que se postularon para una oferta de empleo en particular. Es el punto de control donde se evalúan los perfiles y se decide cómo avanzar en el proceso de selección para esa posición.

En la parte superior, se observa el título del escenario que incluye el nombre de la vacante seleccionada, por ejemplo, "Postulaciones: Desarrollador Fullstack" (AD_04_09). Esto ayuda a mantener el contexto de qué búsqueda se está analizando.

El cuerpo central presenta una tabla (AD_04_11) con la información detallada de los aspirantes:

Postulante: Muestra el nombre y apellido del candidato que aplicó a la oferta.

Fecha: Indica el momento en que el usuario envió su postulación a través del portal.

En la tabla, se dispone de herramientas para la gestión: el botón de Ver Currículum (AD_04_10), abre el visor para analizar el CV del postulante, y el botón de borrar (AD_04_12), que se utiliza para eliminar una postulación.

#pagebreak()
#figure(
  box(
    width: 60%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    /* image-crop(
      read("Capturas/trabajo.com_5173_sign-in(iPad Air) (8).png", encoding: none),
      crop-width: 2360,
      crop-height: 1200,
      crop-start-x: 0,
      crop-start-y: 0,
    ), */
    image("Capturas/trabajo.com_5173_sign-in(iPad Air) (8).png"),
  ),
  caption: [Escenario: AD_05_00 - Añadir vacante],
) <AD_05_00>

#linebreak()
Este escenario presenta el formulario que un administrador utiliza para dar de alta una nueva oportunidad laboral en su empresa. Es el punto de inicio para que la búsqueda sea visible para los postulantes en el portal público una vez que se definen todos los detalles del puesto.

En la parte superior, se observa el título del formulario "Nueva vacante". La interfaz está diseñada para que podamos cargar toda la información técnica y descriptiva necesaria:

Información Básica: Cuenta con el campo Título de la Vacante (AD_05_09), donde se define el nombre del puesto, y el selector de Categoría (AD_05_08).

Detalles del Puesto: Se incluye un área de texto enriquecido para la Descripción (AD_05_10), donde detallamos las responsabilidades y beneficios, y el campo de Habilidades (AD_05_15) para especificar los requisitos técnicos o competencias necesarias.

Condiciones Laborales: Se dispone de selectores para definir el Tipo de Trabajo (AD_05_11)/* —como tiempo completo o medio tiempo—*/, la Modalidad (AD_05_12)/* —presencial, remota o híbrida—*/, el Nivel de Experiencia requerido (AD_05_13) y la Localidad (AD_05_14) geográfica de la vacante.

Para finalizar la carga, el sistema ofrece dos formas de procesar la información según las necesidades:

El botón Publicar (AD_05_16): Al pulsarlo, se guarda la vacante con el estado de "Publicada", lo que la hace visible de inmediato para todos los postulantes en el portal.

El botón Guardar como borrador (AD_05_17): Esta opción registra la información en la base de datos con el estado de "Borrador". Esto permite salvar el progreso y seguir editando la vacante más tarde sin que sea pública todavía.

#pagebreak()
#figure(
  box(
    width: 60%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    /* image-crop(
      read(
        "Capturas/trabajo.com_5173_acme_categorias_atencion-al-cliente_vacantes_53_edit(iPad Air).png",
        encoding: none,
      ),
      crop-width: 2360,
      crop-height: 1300,
      crop-start-x: 0,
      crop-start-y: 0,
    ), */
    image("Capturas/trabajo.com_5173_acme_categorias_atencion-al-cliente_vacantes_53_edit(iPad Air).png"),
  ),
  caption: [Escenario: AD_06_00 - Editar vacante],
) <AD_06_00>

#linebreak()
Este escenario permite modificar la información de una búsqueda laboral que ya está registrada en el sistema. Es una herramienta fundamental para  cuando se necesita ajustar los requisitos de un puesto. // o cambiar la visibilidad de la oferta según el progreso del proceso de selección.

Al ingresar, el sistema utiliza el identificador de la vacante para recuperar automáticamente todos sus datos desde la base de datos y cargarlos en el formulario. En la parte superior, se observa el título del escenario "Editar vacante" (AD_06_08) que cuenta con el título de la vacante a editar.

El formulario de edición presenta los mismos campos que el de creación, pero con la información actual precargada:

Campos de Identificación: Podemos actualizar el Título de la Vacante (AD_06_10) y su Categoría (AD_06_09).

Descripción y Requisitos: El área de texto para la Descripción (AD_06_11) y el campo de Habilidades (AD_06_16) están disponibles para cualquier corrección o ampliación de información.

Condiciones del Puesto: Se pueden ajustar el Tipo de Trabajo (AD_06_12), la Modalidad (AD_06_13), el Nivel de Experiencia (AD_06_14) y la Localidad (AD_06_15).

En la parte inferior, cuenta con una barra de acciones fija que ofrece dos opciones:

Botón de Cerrar (AD_06_17): Al pulsarlo, se cancelan los cambios y regresa al listado de vacantes.

Botón Guardar cambios (AD_06_18): Al pulsarlo, actualizamos toda la información editada en el formulario.

#pagebreak()
#figure(
  box(
    width: 60%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    /* image-crop(
      read("Capturas/trabajo.com_5173_admin_administradores(iPad Air) (1).png", encoding: none),
      crop-width: 2360,
      crop-height: 1500,
      crop-start-x: 0,
      crop-start-y: 0,
    ), */
    image("Capturas/trabajo.com_5173_admin_administradores(iPad Air) (1).png"),
  ),
  caption: [Escenario: AD_07_00 - Confirmar borrar vacante],
) <AD_07_00>

#linebreak()
Este escenario consiste en un cuadro de diálogo que se activa cuando, desde el Listado de vacantes, se pulsa el botón de eliminar en una fila específica. Es la red de seguridad para asegurar que la baja sea una decisión consciente del administrador.

La interfaz presenta los siguientes elementos de control, manteniendo la coherencia visual con el resto del panel:

Título de Advertencia: Un encabezado claro con el texto "Confirmar borrado" para alertar sobre la acción inminente.

// Mensaje de Confirmación (AD_07_02): La pregunta "¿Seguro que querés borrar este elemento?", diseñada para confirmar la intención del usuario.

Botón "Cancelar" (AD_07_01): Al pulsarlo, el modal se cierra sin realizar ninguna acción, permitiéndonos volver al listado y manteniendo la vacante intacta.

Botón "Borrar" (AD_07_02): Ejecuta la solicitud al backend para realizar el borrado de la vacante. Al confirmarse, el registro desaparece del listado activo y el sistema muestra una notificación de éxito.

#pagebreak()
#figure(
  box(
    width: 60%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    /* image-crop(
      read("Capturas/trabajo.com_5173_sign-in(iPad Air) (10).png", encoding: none),
      crop-width: 2360,
      crop-height: 1500,
      crop-start-x: 0,
      crop-start-y: 0,
    ), */
    image("Capturas/trabajo.com_5173_sign-in(iPad Air) (10).png"),
  ),
  caption: [Escenario: AD_08_00 - Listado de categorías],
) <AD_08_00>

#linebreak()
Este escenario representa el panel donde un administrador gestiona las categorías o rubros de empleo de su empresa. Es fundamental para organizar las vacantes de manera lógica y permitir que los postulantes filtren las ofertas según su área de interés.

En la parte superior, se observa el título del módulo "Todas las categorías". El botón "Añadir" (AD_08_09) permite acceder al formulario para crear un nuevo rubro.

El cuerpo central lo compone una tabla interactiva (AD_08_10) donde listamos los datos de cada categoría:

Orden: Un valor numérico que determina en qué posición aparecerá esta categoría en el menú del portal de postulantes.

Categoría: El nombre descriptivo del rubro.

Activada (AD_08_11): Un control de tipo Switch que permite habilitar o deshabilitar la categoría de forma inmediata.

En la columna de Acciones, se dispone del botón Editar (AD_08_12), que abre el formulario para modificar el nombre o el orden de la categoría y del botón Borrar (AD_08_13) que elimina una categoría.

Un detalle importante, es la interacción por fila: al hacer clic en cualquier parte de una fila de la tabla (AD_08_09), el sistema redirige automáticamente al listado de vacantes filtrado exclusivamente por esa categoría, facilitando la gestión específica de cada área.

#pagebreak()
#figure(
  box(
    width: 60%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    /* image-crop(
      read("Capturas/trabajo.com_5173_sign-in(iPad Air) (12).png", encoding: none),
      crop-width: 2360,
      crop-height: 1500,
      crop-start-x: 0,
      crop-start-y: 0,
    ), */
    image("Capturas/trabajo.com_5173_sign-in(iPad Air) (12).png"),
  ),
  caption: [Escenario: AD_09_00 - Listado de vacantes de la categoría],
) <AD_09_00>

#linebreak()
Este escenario permite visualizar de manera exclusiva las búsquedas laborales que pertenecen a un rubro específico. Se accede a esta vista al hacer clic en una fila del listado de categorías, lo que facilita mucho el trabajo cuando la empresa maneja un gran volumen de ofertas y se necesita enfocar en un solo sector.

En la parte superior, se observa un título dinámico que indica claramente en qué sección estamos, por ejemplo: "Vacantes de sistemas". // Justo debajo, contamos con las migas de pan o breadcrumbs (AD_09_02), que nos permiten volver rápidamente al listado general de categorías con un solo clic.

Al igual que en el listado general, disponemos de las herramientas de gestión para este rubro:

Botón Nueva Vacante (AD_09_09): Al pulsarlo, redirige al formulario de creación.

El cuerpo central lo ocupa la tabla de resultados (AD_09_10), que mantiene la misma estructura que del listado global: muestra el título del puesto, la fecha de cierre y el estado de la vacante. En la columna de acciones, se conservan los botones de Editar (AD_09_11) y Eliminar (AD_09_12), permitiendo realizar cambios en los registros sin perder el filtro de la categoría actual.

#pagebreak()
#figure(
  box(
    width: 60%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    /* image-crop(
      read("Capturas/trabajo.com_5173_sign-in(iPad Air) (11).png", encoding: none),
      crop-width: 2360,
      crop-height: 1000,
      crop-start-x: 0,
      crop-start-y: 0,
    ), */
    image("Capturas/trabajo.com_5173_sign-in(iPad Air) (11).png"),
  ),
  caption: [Escenario: AD_10_00 - Añadir categoría],
) <AD_10_00>

#linebreak()
Este escenario muestra el formulario que un administrador utiliza para dar de alta una nueva categoría en nuestra organización. Es un paso fundamental para mantener ordenadas nuestras ofertas laborales y permitir que los postulantes encuentren las vacantes en los rubros que les interesan.

En la parte superior, se observa el título del formulario "Nueva categoría". La interfaz es directa y funcional, diseñada para que se pueda registrar nuevas áreas de trabajo rápidamente:

Nombre de la categoría (AD_10_09): Es el campo de texto donde ingresamos el nombre del rubro.

Orden (AD_10_08): En este campo numérico definimos la prioridad de aparición de la categoría en los menús del portal. // Para agilizarnos el trabajo, el sistema nos sugiere automáticamente el valor "1" por defecto.

Una vez que se completa la información:

Botón Guardar (AD_10_10): Al pulsarlo, el sistema valida los datos y solicita al backend la creación del registro en la base de datos. Si la operación es exitosa, la categoría queda disponible de inmediato para asociarle nuevas vacantes.

#pagebreak()
#figure(
  box(
    width: 60%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    /* image-crop(
      read("Capturas/trabajo.com_5173_sign-in(iPad Air) (16).png", encoding: none),
      crop-width: 2360,
      crop-height: 1000,
      crop-start-x: 0,
      crop-start-y: 0,
    ), */
    image("Capturas/trabajo.com_5173_sign-in(iPad Air) (16).png"),
  ),
  caption: [Escenario: AD_11_00 - Editar categoría],
) <AD_11_00>

#linebreak()
Este escenario permite actualizar la información de un rubro o categoría que ya existe en el sistema. Es la herramienta que utilizamos cuando necesitamos corregir el nombre de un área o simplemente queremos ajustar el orden de prioridad en el que se muestran a los postulantes en el portal.

Al activar la edición desde el listado general, el sistema presenta una interfaz con el título "Editar categoría". Los datos actuales se recuperan automáticamente de la base de datos y aparecen precargados en los campos, permitiendo realizar cambios rápidos sin tener que escribir todo de nuevo:

Nombre de la categoría (AD_11_09): En este campo de texto se puede modificar el nombre del rubro. Mantiene las mismas validaciones de seguridad que en el alta para asegurar la integridad de los datos.

Orden (AD_11_08): Este campo permite redefinir la posición numérica de la categoría. Al cambiar este valor, se altera directamente cómo se organiza visualmente el menú de navegación para los usuarios finales.

Botón Guardar (AD_11_10): Al pulsarlo, el sistema valida la información y envía la petición de actualización al backend. Si todo es correcto, los cambios se reflejan inmediatamente.

#pagebreak()
#figure(
  box(
    width: 60%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    /* image-crop(
      read("Capturas/trabajo.com_5173_admin_administradores(iPad Air) (2).png", encoding: none),
      crop-width: 2360,
      crop-height: 1000,
      crop-start-x: 0,
      crop-start-y: 0,
    ), */
    image("Capturas/trabajo.com_5173_admin_administradores(iPad Air) (2).png"),
  ),
  caption: [Escenario: AD_12_00 - Confirmar borrar categoría],
) <AD_12_00>

#linebreak()
Este escenario consiste en un cuadro de diálogo que se superpone al listado general de categorías cuando se pulsa el ícono de la papelera en una fila específica. Es para garantizar que la estructura organizativa de la empresa no sufra cambios accidentales.

En el centro de la interfaz, se observan los siguientes elementos de control:

Mensaje de Validación y Restricción (AD_12_01): El sistema lanza la pregunta de confirmación e incluye una advertencia técnica. // fundamental: "Solo se puede borrar si está inactiva y no tiene vacantes asociadas". Esta lógica la implementamos para evitar errores en la base de datos MariaDB, impidiendo que borremos un rubro que todavía tiene búsquedas laborales vinculadas.

Botón "Cancelar" (AD_12_02): Permite dar marcha atrás y cerrar el modal sin aplicar ningún cambio, regresando al listado de categorías tal como estaba.

Botón "Borrar" (AD_12_03): Es la acción definitiva. Al pulsarlo, si se cumplen las condiciones de seguridad mencionadas, el sistema procesa la baja del registro y actualiza la vista de forma automática.

#pagebreak()
#figure(
  box(
    width: 60%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    /* image-crop(
      read("Capturas/trabajo.com_5173_sign-in(iPad Air) (13).png", encoding: none),
      crop-width: 2360,
      crop-height: 1000,
      crop-start-x: 0,
      crop-start-y: 0,
    ), */
    image("Capturas/trabajo.com_5173_sign-in(iPad Air) (13).png"),
  ),
  caption: [Escenario: AD_13_00 - Listado de postulantes],
) <AD_13_00>

#linebreak()
Este escenario funciona como "fichero" de candidatos. Es el lugar donde un administrador supervisa a toda la comunidad de profesionales que han mostrado interés en su organización. A diferencia del listado de postulaciones (que está filtrado por vacante), es una visión global de la base de datos de usuarios de su empresa.

En la parte superior, se observa el título del módulo "Todos los postulantes". Justo debajo, hay un botón (AD_13_08) para recargar los datos.

El cuerpo central lo ocupa una tabla de gestión (AD_13_09):

Nombre completo: Muestra la identidad del postulante.

Correo electrónico: Permite identificar la cuenta de usuario y el medio de contacto principal.

Cuil: Muestra el cuil del postulante.

Género: Muestra el género del postulante.

Edad: Muestra la edad del postulante.

Localidad: Muestra la localidad del postulante.

Teléfono: Muestra el teléfono del postulante.

// Observaciones: Muestra las observaciones del postulante.

Habilidades: Muestra las habilidades del postulante.

Estado: Muestra el estado del postulante -Pendiente, Activo, Inactivo-.

Acciones (AD_13_10): Un control de tipo Switch que permite habilitar o deshabilitar el postulante de forma inmediata.

#pagebreak()
#figure(
  box(
    width: 60%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    /* image-crop(
      read("Capturas/trabajo.com_5173_acme_postulantes_DNsUIL0TUqaNpK1zqNk4Tivp9472_herrera-cesar_postulaciones(iPad Air).png", encoding: none),
      crop-width: 2360,
      crop-height: 1000,
      crop-start-x: 0,
      crop-start-y: 0,
    ), */
    image(
      "Capturas/trabajo.com_5173_acme_postulantes_DNsUIL0TUqaNpK1zqNk4Tivp9472_herrera-cesar_postulaciones(iPad Air).png",
    ),
  ),
  caption: [Escenario: AD_14_00 - Listado de postulaciones del postulante],
) <AD_14_00>

#linebreak()
Este escenario presenta una vista detallada de todas las aplicaciones que un postulante en particular ha realizado a vacantes de la empresa de un administrador. Es una herramienta clave para la toma de decisiones, ya que permite ver si un postulante es recurrente o si ha aplicado a perfiles muy distintos entre sí.

En la parte superior, se observa el título dinámico "Postulaciones de [Nombre del Postulante]" (AD_14_07), que confirma inmediatamente a qué perfil se está auditando. Justo debajo del título, cuenta con el Botón de Actualizar (AD_14_08), que permite refrescar la información consultando los últimos registros en la base de datos.

El cuerpo central consiste en una tabla (AD_14_10) que organiza el historial del candidato:

CV (AD_14_09): Al pulsarlo, se puede acceder directamente al currículum que el postulante adjuntó.

Vacante: El nombre del puesto al que aplicó, lo que permite contextualizar su perfil técnico.

Fecha: La tabla muestra el momento de la postulación.

// Para facilitar la navegación, incluimos una estructura de Migas de pan (breadcrumbs) que nos permite volver con un solo clic al listado general de postulantes o a la raíz del panel administrativo, manteniendo siempre el orden de nuestro flujo de trabajo.

#pagebreak()
#figure(
  box(
    width: 60%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    /* image-crop(
      read("Capturas/trabajo.com_5173_sign-in(iPad Air) (14).png", encoding: none),
      crop-width: 2360,
      crop-height: 1000,
      crop-start-x: 0,
      crop-start-y: 0,
    ), */
    image("Capturas/trabajo.com_5173_sign-in(iPad Air) (14).png"),
  ),
  caption: [Escenario: AD_15_00 - Editar estilos de empresa],
) <AD_15_00>

#linebreak()
Este escenario representa el panel de personalización de marca, donde se define la apariencia que tendrá el portal público para los postulantes. Es una funcionalidad clave del sistema, ya que permite aplicar una propia identidad visual sin necesidad de conocimientos técnicos avanzados, logrando que el sistema se sienta como una extensión de la propia empresa.

En la parte superior, se observa el título del módulo y una etiqueta del estado de los cambios (AD_15_08).

Paleta de Colores: Se dispone de un selector de color interactivo para definir la estética de la página. El campo de Color Primario (AD_15_09) se utiliza en acentos, etiquetas y elementos decorativos.

Para aplicar estos cambios en todo el portal, pulsar el botón Guardar cambios (AD_15_11). En ese momento, el sistema actualiza el registro en la base de datos y, de forma automática, los postulantes verán reflejada la nueva identidad visual la próxima vez que ingresen. Si se decide probar los cambios, cuenta con el botón "Previsualizar" (AD_15_10) que redirige al escenario Previsualizar estilos de empresa.

#pagebreak()
#figure(
  box(
    width: 60%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    /* image-crop(
      read("Capturas/trabajo.com_5173_sign-in(iPad Air) (15).png", encoding: none),
      crop-width: 2360,
      crop-height: 2000,
      crop-start-x: 0,
      crop-start-y: 0,
    ), */
    image("Capturas/trabajo.com_5173_sign-in(iPad Air) (15).png"),
  ),
  caption: [Escenario: AD_16_00 - Previsualizar estilos de empresa],
) <AD_16_00>

#linebreak()
Este escenario brinda la posibilidad de visualizar, antes de su publicación definitiva, cómo impactarán los cambios de identidad visual en la interfaz que utilizarán los postulantes. Esta instancia es clave para la gestión, ya que permite garantizar la coherencia estética y la legibilidad del portal antes de que los cambios sean persistidos en la base de datos.

En la sección principal, se presenta un marco de previsualización interactivo donde el sistema renderiza una maqueta en vivo del portal de empleo. En ella, podemos observar de forma directa el comportamiento de los colores sobre los botones de acción, etiquetas de estado y otros componentes de la interfaz de usuario.

Una vez que hemos verificado que el diseño es el adecuado y cumple con nuestros estándares institucionales, contamos con el botón "Guardar cambios" para Volver a la edición (AD_16_03) y proceder con el guardado final, o simplemente cerrar la vista previa si detectamos que aún necesitamos realizar ajustes en la paleta de colores (AD_16_02).

#pagebreak()
=== Rol Postulante

#figure(
  box(
    width: 60%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    image("Capturas/trabajo.com_acme(iPad Air) (1).png"),
  ),
  caption: [Escenario: PO_01_00 - Página principal],
) <PO_01_00>

#linebreak()
Este escenario representa la cara pública de la plataforma y es el punto de encuentro entre las empresas y los postulantes. Es la primera pantalla que ven los usuarios al ingresar al sitio de una organización, por lo que es fundamental que sea clara, atractiva y que refleje inmediatamente la identidad visual se define en los estilos de la empresa.

// En la parte superior, está el encabezado con el nombre de la empresa (PO_01_02) y los botones de acceso rápido para Iniciar Sesión o Registrarse (PO_01_03) y un botón para activar o desactivar el modo obscuro (PO_01_04).

Debajo del encabezado se encuentra la herramienta principal de búsqueda, la Barra de Búsqueda de Vacantes (PO_01_09). Aquí, los postulantes pueden ingresar palabras clave o puestos de interés para filtrar las ofertas disponibles en tiempo real. Y un selector de categorías (PO_01_08) para filtrar las vacantes por un rubro en especial.

En el cuerpo central de la página, se encuentra una lista con las vacantes publicadas. Cada tarjeta de vacante (PO_01_14) incluye información esencial como el título del puesto (PO_01_11), una pequeña descripción (PO_01_12), la categoría (PO_01_10) y la fecha de publicación (PO_01_13). Interactuar con la tarjeta, redirige a esa vacante en especial.

#pagebreak()
#figure(
  box(
    width: 60%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    /* image-crop(
      read("Capturas/trabajo.com_acme_login(iPad Air) (3).png", encoding: none),
      crop-width: 2360,
      crop-height: 1700,
      crop-start-x: 0,
      crop-start-y: 0,
    ), */
    image("Capturas/trabajo.com_acme_login(iPad Air) (3).png"),
  ),
  caption: [Escenario: PO_03_00 - Modal subir currículum],
) <PO_03_00>

#linebreak()
Este escenario consiste en una ventana emergente que se activa cuando el postulante decide aplicar a una vacante o cuando desea actualizar su currículum. Esta interfaz está diseñada como un modal para que el usuario no pierda el contexto de la búsqueda laboral en la que se encuentra, permitiendo una interacción rápida y focalizada.

En el centro del escenario, se observa el título "Sube un currículum", acompañado de una breve instrucción que indica los datos importantes y los requerimientos del archivo a subir.

// Para garantizar la compatibilidad y la seguridad en el procesamiento de los datos, hemos restringido técnicamente la carga exclusivamente a formato PDF (PO_03_04). Esta validación ocurre tanto en el lado del cliente (frontend) como en nuestro backend mediante el uso de la librería Multer, asegurando que los archivos recibidos sean íntegros y legibles para los administradores.

Botón "Añadir CV" (PO_03_01): Al pulsarlo, el sistema inicia un selector de archivos y la transferencia del archivo hacia el servidor de almacenamiento.

Interactuar con un área fuera del modal, permite cerrar la ventana sin realizar cambios, regresando al estado anterior de la navegación.

Una vez que la carga finaliza con éxito, el modal se cierra automáticamente, vinculando el nuevo documento al perfil del usuario.

#pagebreak()
#figure(
  box(
    width: 60%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    /* image-crop(
      read("Capturas/trabajo.com_acme_login(iPad Air).png", encoding: none),
      crop-width: 2360,
      crop-height: 2000,
      crop-start-x: 0,
      crop-start-y: 0,
    ), */
    image("Capturas/trabajo.com_acme_login(iPad Air).png"),
  ),
  caption: [Escenario: PO_05_00 - Iniciar sesión],
) <PO_05_00>

#linebreak()
Este escenario es el punto de entrada para todos los postulantes que ya se encuentran registrados en el sistema. Fue diseñado con una interfaz limpia y minimalista, buscando que el proceso de autenticación sea rápido. // y no interfiera con el objetivo principal del postulante: encontrar empleo.

El formulario de acceso está compuesto por los siguientes elementos:

Correo electrónico (PO_05_08): Campo donde el postulante ingresa su email registrado.

Contraseña (PO_05_09): Campo de texto protegido para la clave de seguridad.

Enlace de recuperación (PO_05_10): Bajo la leyenda "Olvidé mi contraseña", este enlace redirige al escenario de restablecimiento.

Al pulsar el botón "Iniciar sesión" (PO_05_11), el sistema conecta con los servicios de Firebase para validar la identidad del postulante. Si los datos son correctos, el sistema otorga el acceso y redirige al postulante a su panel personal; de lo contrario, muestra un mensaje de error descriptivo para orientar al postulante.

Finalmente, en la parte inferior, se incluye un enlace para Nuevos Usuarios (PO_05_12) que redirige al formulario de registro, asegurando que cualquier persona que llegue a esta pantalla pueda crear su cuenta fácilmente.

#pagebreak()
#figure(
  box(
    width: 60%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    /* image-crop(
      read("Capturas/trabajo.com_acme_login(iPad Air) (2).png", encoding: none),
      crop-width: 2360,
      crop-height: 1700,
      crop-start-x: 0,
      crop-start-y: 0,
    ), */
    image("Capturas/trabajo.com_acme_login(iPad Air) (2).png"),
  ),
  caption: [Escenario: PO_06_00 - Registro],
) <PO_06_00>

#linebreak()
Este escenario representa el formulario de alta para nuevos usuarios que desean postularse a las vacantes de la empresa.

En la parte superior se observa el nombre de la empresa (PO_06_02). El formulario solicita los datos personales esenciales: Nombre (PO_06_08) y Apellido (PO_06_09) para la identificación, seguidos del Correo electrónico (PO_06_10) que servirá como usuario. Para la seguridad de la cuenta, se solicita ingresar una Contraseña (PO_06_11) y su confirmación en el campo Verificar contraseña (PO_06_13). También se incluye un selector de género (PO_06_15) y para la Fecha de nacimiento (PO_06_16).

Una vez completados los campos, el usuario pulsa el botón Continuar (PO_06_17) para crear su cuenta. En caso de ya poseer una, existe un enlace en la parte inferior (PO_06_18) que redirige al inicio de sesión.

#pagebreak()
#figure(
  box(
    width: 60%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    /* image-crop(
      read("Capturas/trabajo.com_acme_login(iPad Air) (1).png", encoding: none),
      crop-width: 2360,
      crop-height: 1800,
      crop-start-x: 0,
      crop-start-y: 0,
    ), */
    image("Capturas/trabajo.com_acme_login(iPad Air) (1).png"),
  ),
  caption: [Escenario: PO_07_00 - Restablecer contraseña],
) <PO_07_00>

#linebreak()
Este escenario permite a los usuarios recuperar el acceso a su cuenta en caso de haber olvidado sus credenciales.

Se presenta una interfaz limpia con el título "Restablecer contraseña" y una breve instrucción que guía al usuario. El formulario consta de un único campo de entrada para el Correo electrónico (PO_07_08), donde el usuario debe ingresar la dirección asociada a su cuenta.

Al pulsar el botón Continuar (PO_07_09), el sistema procesa la solicitud para enviar las instrucciones de recuperación.

#pagebreak()
#figure(
  box(
    width: 60%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    /* image-crop(
      read("Capturas/trabajo.com_acme(iPad Air).png", encoding: none),
      crop-width: 2360,
      crop-height: 800,
      crop-start-x: 0,
      crop-start-y: 0,
    ), */
    image("Capturas/trabajo.com_acme(iPad Air).png"),
  ),
  caption: [Escenario: PO_08_00 - Menú lateral],
) <PO_08_00>

#linebreak()
El menú lateral es el eje de navegación diseñado para que el postulante tenga siempre a mano sus herramientas de gestión personal. En la interfaz se observa los siguientes puntos de interacción:

Botón de Menú (PO_08_01): Un control de tipo "hamburguesa" que permite contraer o expandir la barra lateral, optimizando el espacio de lectura según la preferencia del usuario.

Identidad Corporativa (PO_08_02): En la parte superior del menú se destaca el nombre de la empresa, reforzando la marca empleadora en todo momento.

Acceso a Inicio (PO_08_05): El punto de retorno para volver a la página principal y ver todas las vacantes y categorías disponibles.

Mis Postulaciones (PO_08_07): La sección donde el postulante puede ver sus aplicaciones y verificar el estado de esas vacantes.

Mi Perfil (PO_08_08): El acceso directo para que el usuario mantenga sus datos al día.

Además, se incluyen controles de utilidad global en la cabecera, como el botón de Iniciar Sesión (PO_08_03), el selector de Modo Oscuro (PO_08_04), y una barra para Filtrar vacantes (PO_08_06) que facilita encontrar puestos específicos sin tener que navegar por todo el listado.

#pagebreak()
#figure(
  box(
    width: 60%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    /* image-crop(
      read("Capturas/trabajo.com_acme_login(iPad Air) (4).png", encoding: none),
      crop-width: 2360,
      crop-height: 1000,
      crop-start-x: 0,
      crop-start-y: 0,
    ), */
    image("Capturas/trabajo.com_acme_login(iPad Air) (4).png"),
  ),
  caption: [Escenario: PO_09_00 - Mis postulaciones],
) <PO_09_00>

#linebreak()
Este escenario muestra el listado histórico de las aplicaciones realizadas por el postulante.

En el encabezado se visualiza el título "Mis postulaciones". El cuerpo principal presenta una lista de tarjetas, donde cada una representa una postulación. En cada tarjeta se detalla el puesto al que se aplicó (PO_09_09), la categoría correspondiente (PO_09_10) y la fecha de postulación (PO_09_11). El estado de la solicitud se muestra mediante una etiqueta visual.

Finalmente, cada tarjeta incluye un botón de acción "Dar de baja" (PO_09_12), que permite al usuario retirar su postulación de la vacante si así lo desea y un botón "Ver vacante" (PO_09_13) para cambiar a la vacante postulada.

#pagebreak()
#figure(
  box(
    width: 60%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    image("Capturas/trabajo.com_acme_login(iPad Air) (5).png"),
  ),
  caption: [Escenario: PO_10_00 - Mi perfil],
) <PO_10_00>

#linebreak()
Este escenario permite a un postulante actualizar sus datos en el sistema.

En el encabezado se visualiza el título "Perfil del postulante". El cuerpo principal presenta una lista de campos de textos precargados con los datos existentes del postulante en el sistema.

Nombre completo (PO_10_09 y PO_10_10): Modifica la identidad del postulante. \ Correo electrónico (PO_10_11): Permite identificar la cuenta de usuario y el medio de contacto principal. No se puede modificar. \ Cuil (PO_10_12): Modifica el cuil del postulante. \ Género (PO_10_13): Modifica el género del postulante. \ Fecha de nacimiento (PO_10_14): Modifica la fecha de nacimiento del postulante. \ Localidad (PO_10_15): Modifica la localidad del postulante. \ Teléfono (PO_10_16): Modifica el teléfono del postulante. \ Habilidades (PO_10_17): Modifica las habilidades del postulante.

Finalmente, el botón "Guardar cambios" (PO_10_18) valida los cambios y actualiza los datos del postulante en la base de datos.

#pagebreak()
#figure(
  box(
    width: 60%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    image(
      "Capturas/trabajo.com_acme_reset-password_mode=resetPassword&oobCode=w9kQGzO12eGEuI1sfUqv0KU5DThifkNz8s7grt_0ezYAAAGceGlj1g(iPad Air).png",
    ),
  ),
  caption: [Escenario: PO_11_00 - Cambiar contraseña],
) <PO_11_00>

#linebreak()
Este escenario permite a un postulante cambiar su contraseña en el sistema.

Se visualiza el título "Nueva contraseña". El cuerpo principal presenta una lista de campos de textos para ingresar la nueva contraseña del postulante en el sistema.

Nueva contraseña (PO_11_08): Campo para ingresar una nueva clave de seguridad. \ Repetir nueva contraseña (PO_11_09): Un mecanismo de seguridad, se implementa una validación dinámica que lanza un mensaje de error si los valores ingresados no coinciden, evitando errores de tipeo.

Finalmente, el botón "Confirmar" (PO_11_10) valida los cambios y actualiza los datos del postulante en la base de datos.
