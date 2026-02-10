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
  //- #enlace(<CU09>)[CU09 - Borrar Empresa]
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

#figure(
  image("EspecificacionC/GestionarEmpresas.jpg", width: 100%),
  caption: [Diagrama de casos de uso para Gestionar Empresas],
)

#figure(
  image("EspecificacionC/GestionarAdministradores.jpg", width: 100%),
  caption: [Diagrama de casos de uso para Gestionar Administradores],
)

#figure(
  image("EspecificacionC/Gestionar Cuotas.png", width: 100%),
  caption: [Diagrama de casos de uso para Gestionar Cuotas],
)

#figure(
  image("EspecificacionC/GestionarCategorias.jpg", width: 100%),
  caption: [Diagrama de casos de uso para Gestionar Categorías],
)

#figure(
  image("EspecificacionC/GestionarVacantes.jpg", width: 100%),
  caption: [Diagrama de casos de uso para Gestionar Vacantes],
)

#figure(
  image("EspecificacionC/GestionarPostulantes.jpg", width: 100%),
  caption: [Diagrama de casos de uso para Gestionar Postulantes],
)

#figure(
  image("EspecificacionC/GestionarPostulaciones.jpg", width: 100%),
  caption: [Diagrama de casos de uso para Gestionar Postulaciones],
)

#figure(
  image("EspecificacionC/GestionarCurriculums.jpg", width: 100%),
  caption: [Diagrama de casos de uso para Gestionar Currículums],
)

#pagebreak()
=== Descripción textual de los casos de uso y diagramas de actividad

A continuación se encuentran los casos de uso más relevantes del sistema. Los restantes pueden ser consultados en el Anexo.

#figure(
  caption: [Nueva Empresa],
  table(
    columns: 1fr,
    align: left,
    table.header([CU05 - Nueva Empresa]),

    [Resumen:

      Este caso de uso permite al superadministrador crear una nueva empresa en SGVac. Controla que el _slug_ de la empresa no esté duplicado.],

    [Actores: Superadministrador (primario).],

    [Personal involucrado y metas:

      Superadministrador: quiere crear una nueva empresa de forma rápida y confiable.],

    [Precondiciones:

      El superadministrador ejecutó con éxito el #enlace(<CU01>)[CU01 - Iniciar Sesión Administrador].],

    [Postcondiciones:

      Se registra la empresa en estado activo.],

    [Escenario principal:

      //creo que no hace falta esta precondición en 1...
      1. El superadministrador elige la opción de añadir desde el menú de empresas.
      2. SGVac muestra al superadministrador un formulario para que ingrese el nombre de la empresa y el _slug_ de sitio web de la empresa.
      3. El superadministrador introduce el nombre de la empresa y el _slug_ de sitio web de la empresa.
      4. SGVac da de alta a la empresa en estado activo y regresa al #enlace(<CU04>)[CU04 - Listar Empresas].
    ],

    [Flujos alternativos:

      \
      - A1: el superadministrador no ingresa nombre de la empresa y/o _slug_ del sitio web.

        La secuencia A1 comienza en el punto 3 del escenario principal.
        4. SGVac comunica al superadministrador que el nombre de la empresa y el _slug_ de la url son obligatorios.
        El escenario vuelve al punto 2.

      \
      \
      - A2: el _slug_ del sitio web de la empresa ya existe.

        La secuencia A2 comienza en el punto 3 del escenario principal.
        4. SGVac comunica al superadministrador que el _slug_ del sitio web ya existe.
        El escenario vuelve al punto 2.
    ],
  ),
) <CU05>

#figure(
  image("Actividad/Nueva Empresa.drawio.png", width: 100%),
  caption: [Diagrama de actividad: Nueva Empresa],
)

#pagebreak()
#figure(
  caption: [Registrar Administrador],
  table(
    columns: 1fr,
    align: left,
    table.header([CU12 - Registrar Administrador]),

    [Resumen:

      Este caso de uso permite al superadministrador registrar un nuevo administrador en SGVac y vincularlo a una empresa.
    ],

    [Actores: Superadministrador (primario).],

    [Personal involucrado y metas:

      Superadministrador: quiere registrar un administrador y vincularlo a una empresa de forma rápida y confiable.],

    [Precondiciones:

      El superadministrador ejecutó con éxito el #enlace(<CU01>)[CU01 - Iniciar Sesión Administrador].],

    [Postcondiciones:

      El administrador queda registrado y vinculado a la empresa seleccionada.
    ],

    [Escenario principal:

      1. El superadministrador elige la opción de añadir desde el menú de administradores.
      2. SGVac muestra un formulario para ingresar: correo electrónico, empresa, contraseña y confirmación de contraseña.
      3. El superadministrador completa los campos correo electrónico, contraseña y confirmación de contraseña y selecciona la empresa correspondiente.
      4. SGVac valida los datos, registra al administrador, lo vincula a la empresa seleccionada y vuelve al caso de uso #enlace(<CU10>)[CU10 - Listar Administradores].
    ],

    [Flujos Alternativos:

      - A1: el superadministrador no ingresa correo, empresa, contraseña y/o confirmar contraseña.

        La secuencia A1 comienza en el punto 3 del escenario principal.
        4. SGVac comunica al superadministrador que el correo, empresa, y/o contraseña son obligatorios.
        El escenario vuelve al punto 2.

      - A2: el correo electrónico ya existe.

        La secuencia A2 comienza en el punto 3 del escenario principal.
        4. SGVac comunica al superadministrador que el correo electrónico ya existe.
        El escenario vuelve al punto 2.

      - A3: la empresa está inactiva.

        La secuencia A3 comienza en el punto 3 del escenario principal.
        4. SGVac comunica al superadministrador que la empresa se encuentra inactiva.
        El caso vuelve al punto 2.

      - A4: el superadministrador introduce una contraseña con 5 caracteres o menos.

        La secuencia A4 comienza en el punto 3 del escenario principal.
        4. SGVac comunica al superadministrador que la contraseña debe tener al menos 6 caracteres.
        El caso vuelve al punto 2.

      - A5: la contraseña no coincide con su confirmación.

        La secuencia A5 comienza en el punto 3 del escenario principal.
        4. SGVac comunica al superadministrador que la contraseña no coincide con la confirmación.
        El caso vuelve al punto 2.
    ],
  ),
) <CU12>

#figure(
  image("Actividad/Registrar Administrador.drawio.png", width: 100%),
  caption: [Diagrama de actividad: Registrar Administrador],
)

#pagebreak()
#figure(
  caption: [Listar Vacantes Avanzado],
  table(
    columns: 1fr,
    align: left,
    table.header([CU22 - Listar Vacantes Avanzado]),

    [Resumen:

      Este caso de uso permite al administrador listar las vacantes de su empresa y operar sobre ellas. El listado puede ordenarse en forma ascendente o descendente por categoría, título, localidad, fecha de publicación, fecha de cierre y estado (por defecto, se ordena por fecha de publicación en forma descendente). El listado puede navegarse mediante paginación. Opcionalmente, se pueden filtrar las vacantes por categoría.],

    [Actores: Administrador (primario).],

    [Personal involucrado y metas:

      Administradores: quieren consultar las vacantes de su empresa para operar sobre ellas de forma rápida y confiable.],

    [Precondiciones:

      El administrador ejecutó con éxito el #enlace(<CU01>)[CU01 - Iniciar Sesión Administrador].],

    [Postcondiciones:

      Se muestra una lista con las vacantes de la empresa, con opción a operar con ellas.],

    [Escenario principal:

      1. El Administrador elige la opción “Vacantes” del menú principal.
      2. SGVac muestra al Administrador una lista paginada de vacantes correspondientes a su empresa, con opciones para operar sobre ellas.
      3. El Administrador navega entre las páginas del listado.
      4. SGVac actualiza el listado mostrando la página seleccionada.
      5. El Administrador selecciona un criterio de ordenamiento y una dirección (ascendente/descendente).
      6. SGVac actualiza el listado aplicando el ordenamiento seleccionado.
    ],

    [Flujos Alternativos:

      \
      - A1: El administrador consulta solamente las vacantes asociadas a una categoría de su empresa.

        La secuencia A1 comienza en el punto 1 del escenario principal.
        2. SGVac muestra una lista paginada de vacantes con el filtro de categoría aplicado.
        El escenario vuelve al punto 3.

      \
      \
      - A2: No existen vacantes para mostrar.

        La secuencia A2 comienza en el punto 2 del escenario principal.
        3. SGVac comunica al administrador que no hay resultados y muestra el listado vacío.
        El escenario finaliza.

      /* \
      - A2: Error al obtener el listado.

        La secuencia A2 comienza en los puntos 2, 4 o 6 del escenario principal.
        3. SGVac comunica al Administrador que ocurrió un error al obtener las vacantes.
        El escenario finaliza. */
    ],
  ),
) <CU22>

#figure(
  image("Actividad/Listar Vacantes Avanzado.drawio.png", width: 100%),
  caption: [Diagrama de actividad: Listar Vacantes Avanzado],
)

#pagebreak()
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

      \
      - A1: El postulante no tiene un currículum cargado.

        La secuencia A1 comienza en el punto 2 del escenario principal.
        3. SGVac informa que el postulante no posee un currículum cargado y le ofrece la opción de subir uno.
        El caso de uso termina.

      \
      - A2: El postulante desea reemplazar el currículum cargado por otro.

        La secuencia A2 comienza en el punto 3 del escenario principal.
        4. Postulante selecciona la opción “Reemplazar currículum”.
        El caso de uso termina.

      \
      \
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

#pagebreak()
#figure(
  caption: [Cargar currículum],
  table(
    columns: 1fr,
    align: left,
    table.header([CU40 - Cargar currículum]),

    [Resumen:

      Este caso de uso permite al postulante autenticado cargar un currículum.],

    [Actores: Postulante (primario).],

    [Personal involucrado y metas:

      Postulantes: quieren cargar su currículum vigente de forma rápida y confiable.],

    [Precondiciones:

      El postulante ejecutó con éxito el #enlace(<CU02>)[CU02 - Iniciar Sesión Postulante].],

    [Postcondiciones:

      Queda registrado el currículum vigente del postulante junto con sus metadatos (nombre del archivo y _hash_).],

    [Escenario principal:

      1. El postulante selecciona la opción “Añadir CV”.
      2. SGVac solicita al postulante seleccionar un archivo de currículum en un formato permitido.
      3. El postulante selecciona el archivo y confirma la operación.
      4. SGVac registra el currículum como vigente y muestra un mensaje confirmando la actualización.
    ],

    // no hicimos la validación de que el archivo tiene que ser pdf si o si. Podemos poner todos los archivos en el explorador y poner una imagen por ejemplo.

    [Flujos Alternativos:

      - A1: El postulante ya posee un currículum cargado.

        La secuencia A1 comienza en el punto 1 del escenario principal.
        2. SGVac redirige al postulante al #enlace(<CU39>)[CU39 - Ver Currículum] y le ofrece al postulante la opción de "Reemplazar currículum".
        3. El postulante elije la opción "Reemplazar currículum".
        El escenario vuelve al punto 2.

      - A2: El postulante no confirma la carga del currículum.

        La secuencia A2 comienza en el punto 3 del escenario principal.
        4. El postulante decide no confirmar la carga del currículum.
        El caso de uso termina.

      - A3: Error al subir o guardar el currículum.

        La secuencia A3 comienza en el punto 3 del escenario principal.
        4. SGVac informa al postulante por un mensaje que hubo un error durante la carga o el registro del archivo.
        El caso de uso termina.
    ],
  ),
) <CU40>

#figure(
  image("Actividad/Cargar currículum.drawio.png", width: 100%),
  caption: [Diagrama de actividad: Cargar currículum],
)