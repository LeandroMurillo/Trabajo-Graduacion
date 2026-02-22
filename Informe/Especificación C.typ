#let enlace(url, body) = {
  link(url, [#body ])
}

#pagebreak()
= Especificación C

== Modelización del sistema

=== Actores

Un actor interactúa con el sistema, pudiendo ser estos un usuario u otro sistema. Los actores identificados son:

- Superadministrador
- Administradores
- Postulantes

#figure(
  image("EspecificacionC/Actores.jpg", width: 100%),
  caption: [Diagrama de Actores],
)

=== Diagrama de contexto

#figure(
  image("EspecificacionC/DiagramaDeContexto.jpg", width: 100%),
  caption: [Diagrama de Contexto],
)

#linebreak()
=== Diagrama de subsistema

#figure(
  image("EspecificacionC/DiagramaDeSubsistema.jpg", width: 100%),
  caption: [Diagrama de Subsistema],
)

=== Listado de casos de uso

- Autenticación

  - #enlace(<CU01>)[CU01 - Iniciar Sesión Administrador]
  - #enlace(<CU02>)[CU02 - Iniciar Sesión Postulante]
  - #enlace(<CU03>)[CU03 - Cerrar Sesión]

#linebreak()
- Gestión Empresas

  - #enlace(<CU04>)[CU04 - Listar Empresas]
  - #enlace(<CU05>)[CU05 - Nueva Empresa]
  - #enlace(<CU06>)[CU06 - Modificar Empresa]
  - #enlace(<CU07>)[CU07 - Activar Empresa]
  - #enlace(<CU08>)[CU08 - Dar de baja Empresa]
  - #enlace(<CU09>)[CU09 - Borrar Empresa]
  - #enlace(<CU10>)[CU10 - Modificar Estilos de Empresa]

#linebreak()
- Gestión Administradores

  - #enlace(<CU11>)[CU11 - Listar Administradores]
  - #enlace(<CU12>)[CU12 - Registrar Administrador]
  - #enlace(<CU13>)[CU13 - Modificar Administrador]
  - #enlace(<CU14>)[CU14 - Borrar Administrador]

#linebreak()
- Gestión Cuotas

  - #enlace(<CU15>)[CU15 - Listar Cuotas]

#linebreak()
- Gestión Categorías

  - #enlace(<CU16>)[CU16 - Listar categorías]
  - #enlace(<CU17>)[CU17 - Nueva Categoría]
  - #enlace(<CU18>)[CU18 - Modificar Categoría]
  - #enlace(<CU19>)[CU19 - Activar Categoría]
  - #enlace(<CU20>)[CU20 - Dar De Baja Categoría]
  - #enlace(<CU21>)[CU21 - Borrar Categoría]

#linebreak()
- Gestión Vacantes

  - #enlace(<CU22>)[CU22 - Listar Vacantes Avanzado]
  - #enlace(<CU23>)[CU23 - Listar Vacantes]
  - #enlace(<CU24>)[CU24 - Nueva Vacante]
  - #enlace(<CU25>)[CU25 - Modificar Vacante]
  - #enlace(<CU26>)[CU26 - Publicar Vacante]
  - #enlace(<CU27>)[CU27 - Cerrar Vacante]
  - #enlace(<CU28>)[CU28 - Borrar vacante]

#linebreak()
- Gestión Postulantes

  - #enlace(<CU29>)[CU29 - Listar Postulantes]
  - #enlace(<CU30>)[CU30 - Registrar Postulante]
  - #enlace(<CU31>)[CU31 - Modificar Datos Perfil Postulante]
  - #enlace(<CU32>)[CU32 - Activar cuenta]
  - #enlace(<CU33>)[CU33 - Restablecer contraseña]
  - #enlace(<CU41>)[CU41 - Cambiar Contraseña]
  - #enlace(<CU42>)[CU42 - Inactivar Postulante]
  - #enlace(<CU43>)[CU43 - Reactivar Postulante]

#linebreak()
- Gestión Postulaciones

  - #enlace(<CU34>)[CU34 - Listar Postulaciones de una Vacante]
  - #enlace(<CU35>)[CU35 - Listar Postulaciones de un Postulante]
  - #enlace(<CU36>)[CU36 - Listar Mis Postulaciones]
  - #enlace(<CU37>)[CU37 - Nueva Postulación]
  - #enlace(<CU38>)[CU38 - Dar De Baja Postulación]

#linebreak()
- Gestión Currículums

  - #enlace(<CU39>)[CU39 - Ver currículum]
  - #enlace(<CU40>)[CU40 - Cargar currículum]

#linebreak()
=== Diagramas de casos de uso

Ver anexo: #enlace(<DiagCU>)[Diagramas de casos de uso].

#pagebreak()
=== Descripción textual de los casos de uso y diagramas de actividad

A continuación se encuentra un caso de uso relevante del sistema. Los restantes pueden ser consultados en el anexo: #enlace(<DescCU>)[Descripción textual de los casos de uso].

#figure(
  caption: [Nueva Postulación],
  table(
    columns: 1fr,
    align: left,
    table.header([CU37 - Nueva Postulación]),

    [Resumen:

      Este caso de uso permite al postulante autenticado postularse a una vacante publicada por una empresa, registrando la postulación y confirmando el resultado al usuario.],

    [Actores: Postulante (primario).],

    [Personal involucrado y metas:

      Postulantes: quieren postularse a una vacante publicada por una empresa de forma rápida y confiable.],

    [Precondiciones:

      El postulante ejecutó con éxito el #enlace(<CU02>)[CU02 - Iniciar Sesión Postulante].],

    [Postcondiciones:

      Se registra la postulación con el currículum adjunto.],

    [Escenario principal:

      1. El postulante accede a la página de una vacante y presiona el botón “Postularme”.
      2. SGVac muestra al postulante una vista previa del currículum que tiene cargado actualmente.
      3. El postulante confirma la postulación.
      4. SGVac registra la postulación, asociándola a la vacante y al currículum confirmado, y muestra un mensaje de éxito.
    ],

    [Flujos Alternativos:

      - A1: El postulante no tiene un currículum cargado.

        La secuencia A1 comienza en el punto 2 del escenario principal.
        3. SGVac informa que el postulante no posee un currículum cargado y le ofrece la opción de subir uno.
        El caso de uso termina.

      - A2: El postulante desea reemplazar el currículum cargado por otro.

        La secuencia A2 comienza en el punto 3 del escenario principal.
        4. Postulante selecciona la opción “Reemplazar currículum”.
        El caso de uso termina.

      - A3: El postulante no confirma la postulación.

        La secuencia A3 comienza en el punto 3 del escenario principal.
        4. El postulante decide no confirmar la postulación.
        El caso de uso termina.

      - A4: El postulante ya se ha postulado a esa vacante.

        La secuencia A4 comienza en el punto 1 del escenario principal.
        2. SGVac informa al postulante que ya se encuentra postulado y no registra una nueva postulación.
        El caso de uso termina.
    ],
  ),
) <CU37>

#figure(
  image("Actividad/Nueva Postulación.drawio.png", width: 98%),
  caption: [Diagrama de actividad: Nueva Postulación],
)
