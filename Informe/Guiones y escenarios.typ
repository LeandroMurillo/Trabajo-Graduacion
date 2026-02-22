#import "@preview/grayness:0.5.0": *
#let enlace(url, body) = {
  link(url, [#body ])
}

== Guiones y escenarios

Para esta sección se deben tener en cuenta los siguientes acrónimos:

#align(center)[SU: Superadministrador, AD: Administrador, PO: Postulante]

=== Diagramas de transición de escenarios

A continuación se encuentran los diagramas del Rol Postulante. Los restantes pueden ser consultados en el anexo: #enlace(<DiagEsc>)[Diagramas de transición de escenarios].

==== Rol Postulante

#figure(
  rect(
    width: 97%,
    stroke: 0.5pt + rgb("#333333"),
    radius: 4pt,
    outset: 0pt,
    image("TransiciónEscenarios/Postulante.drawio.png"),
  ),
  caption: [Diagrama de transición: Rol Postulante],
)

#linebreak()
=== Tablas de transición de escenarios

#pagebreak()
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

#align(right)[
  #rotate(90deg, reflow: true)[
    #figure(
      caption: [Rol Postulante],
      {
        // Ponemos en negrita la primera columna (x: 0) y la primera fila (y: 0)
        show table.cell.where(x: 0): set text(weight: "bold")
        show table.cell.where(y: 0): set text(weight: "bold")

        set text(size: 0.6em)
        set par(justify: false)

        table(
          columns: (2fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr, 1fr),
          rows: 1.1cm,
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
          [#link(<PO_01_00>)[PO_01_00]],
          [#link(<PO_02_00>)[PO_02_00]],
          [#link(<PO_03_00>)[PO_03_00]],
          [#link(<PO_04_00>)[PO_04_00]],
          [#link(<PO_05_00>)[PO_05_00]],
          [#link(<PO_06_00>)[PO_06_00]],
          [#link(<PO_07_00>)[PO_07_00]],
          [#link(<PO_08_00>)[PO_08_00]],
          [#link(<PO_09_00>)[PO_09_00]],
          [#link(<PO_10_00>)[PO_10_00]],
          [#link(<PO_11_00>)[PO_11_00]],

          [],
          [Ingresa \ a la plataforma],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [Ingresa a nueva contraseña],

          [#enlace(<PO_01_00>)[PO_01_00 \ Página principal]],
          [        ],
          [PO_01_14],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [PO_01_01],
          [        ],
          [        ],
          [        ],

          [#enlace(<PO_02_00>)[PO_02_00 \ Detalle vacante]],
          [        ],
          [        ],
          [        ],
          [PO_02_14],
          [        ],
          [        ],
          [        ],
          [PO_02_01],
          [        ],
          [        ],
          [        ],

          [#enlace(<PO_03_00>)[PO_03_00 \ Modal subir currículum]],
          [        ],
          [PO_03_02],
          [        ],
          [PO_03_01],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],

          [#enlace(<PO_04_00>)[PO_04_00 \ Modal postularse]],
          [        ],
          [PO_04_02
           PO_04_03],
          [PO_04_01],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],

          [#enlace(<PO_05_00>)[PO_05_00 \ Iniciar sesión]],
          [PO_05_11],
          [        ],
          [        ],
          [        ],
          [        ],
          [PO_05_12],
          [PO_05_10],
          [PO_05_01],
          [        ],
          [        ],
          [        ],

          [#enlace(<PO_06_00>)[PO_06_00 \ Registro]],
          [        ],
          [        ],
          [        ],
          [        ],
          [PO_06_17
           PO_06_18],
          [        ],
          [        ],
          [PO_06_01],
          [        ],
          [        ],
          [        ],

          [#enlace(<PO_07_00>)[PO_07_00 \ Restablecer contraseña]],
          [        ],
          [        ],
          [        ],
          [        ],
          [PO_07_09],
          [        ],
          [        ],
          [PO_07_01],
          [        ],
          [        ],
          [        ],

          [#enlace(<PO_08_00>)[PO_08_00 \ Menú lateral]],
          [PO_08_05],
          [        ],
          [        ],
          [        ],
          [PO_08_03],
          [        ],
          [        ],
          [PO_08_01],
          [PO_08_06],
          [PO_08_08],
          [        ],

          [#enlace(<PO_09_00>)[PO_09_00 \ Mis postulaciones]],
          [        ],
          [PO_09_13],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [PO_09_01],
          [        ],
          [        ],
          [        ],

          [#enlace(<PO_10_00>)[PO_10_00 \ Mi perfil]],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [PO_10_01],
          [        ],
          [PO_10_18],
          [        ],

          [#enlace(<PO_11_00>)[PO_11_00 \ Cambiar contraseña]],
          [PO_11_10],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [        ],
          [PO_11_01],
          [        ],
          [        ],
          [        ],
        )
      },
    )
  ]
]

#pagebreak()
== Descripción de escenarios

Se desarrollaron escenarios para todos los roles del sistema abarcando las principales funcionalidades y flujos de trabajo. Los escenarios incluyen representaciones visuales de las interfaces de usuario y descripciones paso a paso de las interacciones.

A continuación se encuentran escenarios relevantes del sistema. Los restantes pueden ser consultados en el anexo: #enlace(<DescEsc>)[Descripción de escenarios].

=== Rol Postulante

#figure(
  box(
    width: 53%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    image("Capturas/trabajo.com_acme(iPad Air) (2).png"),
  ),
  caption: [Escenario: PO_02_00 - Detalle vacante],
) <PO_02_00>

#linebreak()
Este escenario es el punto donde se presenta toda la información específica de una búsqueda laboral. Es de vital importancia que esta vista sea clara y esté bien organizada, permitiendo que el candidato comprenda rápidamente las responsabilidades del puesto y los requisitos que se solicitan.

En la parte superior, está la cabecera de la vacante, que incluye el título del puesto (PO_02_10), la categoría a la que pertenece (PO_02_08) y la ubicación (PO_02_09). Inmediatamente debajo, se encuentra una fila de Etiquetas Rápidas (PO_02_11) que resumen la modalidad (remoto/híbrido), el tipo de jornada y la fecha de publicación, facilitando una lectura veloz de las condiciones básicas.

El cuerpo principal cuenta con dos secciones:

Descripción del Puesto (PO_02_12): Es el área donde se detalla el contenido de la búsqueda. Aquí el postulante puede ver la información con formato (negritas, listas, etc.), lo que hace que la lectura sea mucho más amena.

Requisitos y Habilidades (PO_02_13): En este apartado se listan las competencias técnicas y blandas que se busca para el perfil.

Finalmente, contamos con el botón principal "Postularse" (PO_02_14). Si el postulante postulante no ha iniciado sesión, el sistema lo redirigirá al formulario de ingreso antes de procesar su postulación.

#pagebreak()
#figure(
  box(
    width: 60%,
    stroke: 0.5pt + rgb("#333333"),
    clip: true,
    inset: 0pt,
    radius: 4pt,
    outset: 0pt,
    image("Capturas/trabajo.com_acme_login(iPad Air)(2).png"),
  ),
  caption: [Escenario: PO_04_00 - Modal postularse],
) <PO_04_00>

#linebreak()
Este escenario consiste en una ventana emergente de confirmación que actúa como el paso final del flujo de aplicación. Fue diseñado para evitar postulaciones accidentales y para darle al postulante una última oportunidad de revisar su currículum subido al sistema.

En el centro del modal, se observa el currículum del postulante actualmente subido al sistema. Si el postulante desea cambiar su currículum puede hacerlo con el botón "Remplazar currículum" (PO_04_01) que redirige al modal subir currículum.

Botón "Postularse" (PO_04_03): Al pulsarlo, el sistema registra el vínculo entre el postulante y la vacante en la base de datos.

Botón "Cancelar" (PO_04_02): Permite cerrar el modal y regresar al detalle de la vacante sin realizar ninguna acción.

Una vez que la operación se completa con éxito, el modal desaparece y se muestra al postulante una notificación visual confirmando que su postulación ha sido recibida correctamente por la empresa.
