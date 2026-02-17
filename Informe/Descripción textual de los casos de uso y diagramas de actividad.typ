#import "@preview/grayness:0.5.0": *

#let enlace(url, body) = {
  link(url, [#body ])
}

#pagebreak()
== Descripción textual de los casos de uso y diagramas de actividad

#figure(
  caption: [Iniciar Sesión Administrador],
  table(
    columns: 1fr,
    align: left,
    table.header([CU01 - Iniciar Sesión Administrador]),

    [Resumen:

      Este caso de uso permite a los administradores y al superadministrador iniciar sesión en el panel de administración. SGVac valida las credenciales, genera el _token_ de sesión, devuelve los datos del actor autenticado y carga los permisos del actor para personalizar las opciones del panel.],

    [Actores: Administrador (primario), Superadministrador (primario).],

    [Personal involucrado y metas:

      Administradores y Superadministrador: quieren que SGVac los valide y les muestre las opciones correspondientes a sus permisos de forma rápida y confiable.],

    [Precondiciones:

      El administrador y el superadministrador se encuentran registrados en SGVac y además la cuenta del administrador está activa.],

    [Postcondiciones:

      Se valida al administrador / superadministrador, se genera _token_ de sesión y se le muestra sus opciones personales.
    ],

    [Escenario principal:

      1. El administrador / superadministrador ingresa la dirección del panel de administración desde un dispositivo conectado a Internet.
      2. SGVac muestra un formulario de inicio de sesión para ingresar correo electrónico y contraseña.
      3. El administrador / superadministrador introduce su correo electrónico y contraseña.
      4. SGVac genera el _token_ de sesión, registra el ingreso y muestra las opciones disponibles según los permisos correspondientes.
    ],

    [Flujos Alternativos:

      - A1: Credenciales inválidas (no existe o contraseña incorrecta)

        La secuencia A1 comienza en el punto 3 del escenario principal.
        4. SGVac informa al administrador / superadministrador que las credenciales son inválidas.
        El caso de uso vuelve al punto 2.
    ],
  ),
) <CU01>

#figure(
  image("Actividad/Iniciar Sesión Admin.drawio.png", width: 100%),
  caption: [Diagrama de actividad: Iniciar Sesión Administrador],
)

#pagebreak()
#figure(
  caption: [Iniciar Sesión Postulante],
  table(
    columns: 1fr,
    align: left,
    table.header([CU02 - Iniciar Sesión Postulante]),

    [Resumen:

      Este caso de uso permite al postulante iniciar sesión en el sistema. Genera el _token_ de sesión, devuelve los datos del postulante.],

    [Actores: Postulante (primario)],

    [Personal involucrado y metas:

      Postulantes: quieren que SGVac los valide como tal de forma rápida y confiable.],

    [Precondiciones:

      El postulante se encuentra creado en SGVac.],

    [Postcondiciones:

      Se valida al postulante, se genera _token_ de sesión y se le muestran sus opciones personales.],

    [Escenario principal:

      1. El postulante ingresa la dirección del sitio web de una empresa de la plataforma en un dispositivo conectado a Internet.
      2. SGVac muestra al postulante un formulario para que ingrese su dirección de correo y contraseña.
      3. El postulante introduce su dirección de correo y contraseña.
      4. SGVac genera el _token_ de sesión, lo registra en su sesión y muestra al postulante sus opciones personales.
    ],

    [Flujos alternativos:

      - A1: el postulante no existe.

        La secuencia A1 comienza en el punto 3 del escenario principal.
        4. SGVac comunica al postulante que las credenciales son erróneas.
        El escenario vuelve al punto 2.

      - A2: la contraseña es inválida.

        La secuencia A2 comienza en el punto 3 del escenario principal.
        4. SGVac comunica al postulante que las credenciales son erróneas.
        El escenario vuelve al punto 2.
    ],
  ),
) <CU02>

#figure(
  image("Actividad/Iniciar Sesión Postulante.drawio.png", width: 100%),
  caption: [Diagrama de actividad: Iniciar Sesión Postulante],
)

#pagebreak()
#figure(
  caption: [Cerrar Sesión],
  table(
    columns: 1fr,
    align: left,
    table.header([CU03 - Cerrar Sesión]),

    [Resumen:

      Este caso de uso permite a las personas cerrar sesión en el sistema borrando el _token_.],

    [Actores: Personas (primario).],

    [Personal involucrado y metas:

      Persona: quiere que el sistema cierre su sesión de manera que nadie pueda ingresar a su cuenta luego del inicio de sesión y operación de el sistema.],

    [Precondiciones:

      La persona se encuentra con sesión iniciada y no caduca en el sistema.],

    [Postcondiciones:

      Se cierra la sesión a la persona y se borra el _token_.],

    [Escenario principal:

      1. La persona está con sesión iniciada en el sistema y elige cerrar la sesión.
      2. El sistema cierra la sesión y borra el _token_.
    ],

    [Flujos alternativos: No hay.],
  ),
) <CU03>

#figure(
  image("Actividad/Cerrar Sesión.drawio.png", width: 100%),
  caption: [Diagrama de actividad: Cerrar Sesión],
)

#pagebreak()
#figure(
  caption: [Listar Empresas],
  table(
    columns: 1fr,
    align: left,
    table.header([CU04 - Listar Empresas]),

    [Resumen:

      Este caso de uso permite al superadministrador listar las empresas. Una vez localizada la empresa, se puede operar con ella.],

    [Actores: Superadministrador (primario).],

    [Personal involucrado y metas:

      Superadministrador: quiere listar las empresas para operar de forma rápida y confiable.],

    [Precondiciones:

      El superadministrador ejecutó con éxito el #enlace(<CU01>)[CU01 - Iniciar Sesión Administrador].],

    [Postcondiciones:

      Se muestra una lista con las empresas, con opción a operar con ellas.],

    [Escenario principal:

      1. El superadministrador elige la opción de listar empresas del menú principal.
      2. El sistema muestra al superadministrador una lista con las empresas, con opción a operar con ellas.
    ],

    [Flujos alternativos: No hay.
      /* - A1: no existen empresas.
      La secuencia A1 comienza en el punto 1 del escenario principal.
      2. El sistema comunica al superadministrador que no hay resultados. */
    ],
  ),
) <CU04>

#figure(
  image("Actividad/Listar Empresas.drawio.png", width: 100%),
  caption: [Diagrama de actividad: Listar Empresas],
)

// TODO: NI SIQUIERA ESTÁ HECHO!!!!!!!!!!!!
#pagebreak()
#figure(
  caption: [Modificar Empresa],
  table(
    columns: 1fr,
    align: left,
    table.header([CU06 - Modificar Empresa]),

    [Resumen:

      Este caso de uso permite al superadministrador modificar una empresa existente. El slug del sitio de la empresa no puede estar duplicado.],

    [Actores: Superadministrador (primario).],

    [Personal involucrado y metas:

      Superadministrador: quiere modificar una empresa existente de forma rápida y confiable.],

    [Precondiciones:

      El superadministrador ejecutó con éxito el #enlace(<CU04>)[CU04 - Listar Empresas], y la empresa a modificar se encuentra en los resultados de búsqueda.],

    [Postcondiciones:

      Se modifica la empresa.],

    [Escenario principal:

      1. El superadministrador ejecuta el #enlace(<CU04>)[CU04 - Listar Empresas] y elige la opción modificar de la empresa elegida.
      2. El sistema muestra al superadministrador un formulario para que modifique el nombre de la empresa y el _slug_ del sitio web.
      3. El superadministrador introduce el nombre de la empresa y el _slug_ del sitio web.
      4. El sistema modifica la empresa y vuelve al #enlace(<CU04>)[CU04 - Listar Empresas].
    ],

    [Flujos alternativos:

      - A1: El superadministrador no ingresa el nombre o _slug_ de la empresa.

        La secuencia A1 comienza en el punto 3 del escenario principal.
        4. El sistema comunica al superadministrador que el nombre y el _slug_ de la empresa son obligatorios.
        El escenario vuelve al punto 2.

      - A2: El _slug_ de la empresa ya está en uso.

        La secuencia A2 comienza en el punto 3 del escenario principal.
        4. El sistema comunica al superadministrador que el _slug_ de la empresa ya está en uso.
        El escenario vuelve al punto 2.

      - A3: El _slug_ tiene un formato no válido.

        La secuencia A3 comienza en el punto 3 del escenario principal.
        4. El sistema comunica al superadministrador que la url debe ser un _slug_ (minúsculas, números y guiones).
        El escenario vuelve al punto 2.
    ],
  ),
) <CU06>

#figure(
  image("Actividad/Modificar Empresa.drawio.png", width: 100%),
  // image-huerotate(read("Actividad/Modificar Empresa.drawio.png", encoding: none), amount: 100),
  caption: [Diagrama de actividad: Modificar Empresas],
)

#pagebreak()
#figure(
  caption: [Activar Empresa],
  table(
    columns: 1fr,
    align: left,
    table.header([CU07 - Activar Empresa]),

    [Resumen:

      Este caso de uso permite al superadministrador activar una empresa existente. La empresa tiene que estar inactiva.],

    [Actores: Superadministrador (primario).],

    [Personal involucrado y metas:

      Superadministrador: quiere activar una empresa existente de forma rápida y confiable.],

    [Precondiciones:

      El superadministrador ejecutó con éxito el #enlace(<CU04>)[CU04 - Listar Empresas], y la empresa a activar se encuentra en los resultados de búsqueda.],

    [Postcondiciones:

      Se activa la empresa.],

    [Escenario principal:

      1. El superadministrador ejecuta el #enlace(<CU04>)[CU04 - Listar Empresas] y elige la opción activar de la empresa elegida.
      2. El sistema muestra al superadministrador una confirmación de la activación de la empresa.
      3. El superadministrador confirma la activación.
      4. El sistema activa la empresa y vuelve al #enlace(<CU04>)[CU04 - Listar Empresas].
    ],

    [Flujos alternativos: No hay.],
  ),
) <CU07>

#figure(
  image("Actividad/Activar Empresa.drawio.png", width: 100%),
  caption: [Diagrama de actividad: Activar Empresa],
)

#pagebreak()
#figure(
  caption: [Dar De Baja Empresa],
  table(
    columns: 1fr,
    align: left,
    table.header([CU08 - Dar De Baja Empresa]),

    [Resumen:

      Este caso de uso permite al superadministrador dar de baja una empresa existente.],

    [Actores: Superadministrador (primario).],

    [Personal involucrado y metas:

      Superadministrador: quiere dar de baja una empresa existente de forma rápida y confiable.],

    [Precondiciones:

      El superadministrador ejecutó con éxito el #enlace(<CU04>)[CU04 - Listar Empresas], y la empresa a dar de baja se encuentra en los resultados de búsqueda.],

    [Postcondiciones:

      Se da de baja la empresa.],

    [Escenario principal:

      1. El superadministrador ejecuta el #enlace(<CU04>)[CU04 - Listar Empresas] y elige la opción dar de baja de la empresa elegida.
      2. El sistema muestra al superadministrador una confirmación de la baja de la empresa.
      3. El superadministrador confirma la baja.
      4. El sistema da de baja la empresa y vuelve al #enlace(<CU04>)[CU04 - Listar Empresas].
    ],

    [Flujos alternativos: No hay.],
  ),
) <CU08>

#figure(
  image("Actividad/Dar de Baja Empresa.drawio.png", width: 100%),
  caption: [Diagrama de actividad: Dar de Baja Empresa],
)

#pagebreak()
#figure(
  caption: [Borrar Empresa],
  table(
    columns: 1fr,
    align: left,
    table.header([CU09 - Borrar Empresa]),

    [Resumen:

      Este caso de uso permite al superadministrador borrar una empresa cliente existente, siempre y cuando esté en estado Inactiva.],

    [Actores: Superadministrador (primario).],

    [Personal involucrado y metas:

      Superadministrador: quiere borrar una empresa cliente existente de forma rápida y confiable.],

    [Precondiciones:

      El superadministrador ejecutó con éxito el #enlace(<CU04>)[CU04 - Listar Empresas], y la empresa a borrar se encuentra en los resultados de búsqueda.],

    [Postcondiciones:

      Se borra la empresa.],

    [Escenario principal:

      1. El superadministrador ejecuta el #enlace(<CU04>)[CU04 - Listar Empresas] y elige la opción borrar la empresa elegida.
      2. SGVac muestra al superadministrador una confirmación del borrado de la empresa.
      3. El superadministrador confirma el borrado.
      4. SGVac borra la empresa y vuelve al #enlace(<CU04>)[CU04 - Listar Empresas].
    ],

    [Flujos alternativos:

      - A1: el superadministrador no confirma el borrado de la empresa

        La secuencia A1 comienza en el punto 2 del escenario principal.
        3. El administrador decide no confirmar el borrado de la empresa.
        El caso de uso termina.

      - A2: la empresa a borrar está en estado Activa

        La secuencia A2 comienza en el punto 3 del escenario principal.
        3. SGVac informa al superadministrador que la empresa está activa y debe inactivar la empresa para borrarla.
        El caso de uso termina.

      - A3: la empresa a borrar tiene categorias asociadas

        La secuencia A3 comienza en el punto 3 del escenario principal.
        3. SGVac informa al superadministrador que no puede borrar la empresa porque tiene categorias asociadas.
        El caso de uso termina.

      - A4: la empresa a borrar tiene cuotas asociadas

        La secuencia A4 comienza en el punto 3 del escenario principal.
        3. SGVac informa al superadministrador que no puede borrar la empresa porque tiene cuotas asociadas.
        El caso de uso termina.

      - A5: la empresa a borrar tiene administradores asociadas

        La secuencia A5 comienza en el punto 3 del escenario principal.
        3. SGVac informa al superadministrador que no puede borrar la empresa porque tiene administradores asociadas.
        El caso de uso termina.

    ],
  ),
) <CU09>

#figure(
  image("Actividad/Borrar Empresa.drawio.png", width: 100%),
  caption: [Diagrama de actividad: Borrar Empresa],
)

#pagebreak()
#figure(
  caption: [Modificar Estilos de Empresa],
  table(
    columns: 1fr,
    align: left,
    table.header([CU10 - Modificar Estilos de Empresa]),

    [Resumen:

      Este caso de uso permite al administrador modificar los estilos visuales asociados a su empresa (por ejemplo, el color primario), previsualizar los cambios y guardarlos para que se apliquen en la interfaz del sistema correspondiente a esa empresa.],

    [Actores: Administrador (primario).],

    [Personal involucrado y metas:

      Administradores: quieren modificar los estilos de su empresa de forma rápida y confiable.],

    [Precondiciones:

      El administrador ejecutó con éxito el #enlace(<CU01>)[CU01 - Iniciar Sesión Administrador].],

    [Postcondiciones:

      Los estilos asociados a la empresa se guardan y se renderizan en la interfaz correspondiente.
    ],

    [Escenario principal:

      1. El Administrador elige la opción “Estilos” del menú principal.
      2. SGVac muestra el formulario con los estilos actuales de la empresa.
      3. El Administrador modifica uno o más parámetros de estilo y solicita guardar los cambios.
      4. SGVac muestra una confirmación de los cambios los cuales afectarán al sitio de usuarios de su empresa.
      5. El administrador confirma los cambios de estilo que se efectuarán.
      6. SGVac informa el resultado exitoso y aplica los cambios al sitio de usuarios de la empresa.
    ],

    [Flujos alternativos:

      - A1: el administrador no guarda los cambios realizados.

        La secuencia A1 comienza en el punto 3 del escenario principal.
        4. SGVac informa que hay cambios sin publicar.
        El escenario vuelve al punto 2.

      - A2: el administrador no confirma los cambios realizados.

        La secuencia A2 comienza en el punto 5 del escenario principal. \ El escenario vuelve al punto 2.

      // esta validación de campos no está todavía en el backend. Pero debería estar.
      /* A3: Uno o más campos son inválidos.

      La secuencia A3 comienza en el punto 6 del escenario principal.
      4. SGVac informa que uno o más campos son inválidos.
      El escenario vuelve al punto 3. */
    ],
  ),
) <CU10>

#figure(
  image("Actividad/Modificar Estilos de Empresa.drawio.png", width: 100%),
  caption: [Diagrama de actividad: Modificar Estilos de Empresa],
)

#pagebreak()
#figure(
  caption: [Listar Administradores],
  table(
    columns: 1fr,
    align: left,
    table.header([CU11 - Listar Administradores]),

    [Resumen:

      Este caso de uso permite al superadministrador listar los administradores. Una vez localizado el administrador, se puede operar con él.],

    [Actores: Superadministrador (primario).],

    [Personal involucrado y metas:

      Superadministrador: quiere listar los administradores para operar de forma rápida y confiable.],

    [Precondiciones:

      El superadministrador ejecutó con éxito el #enlace(<CU01>)[CU01 - Iniciar Sesión Administrador].],

    [Postcondiciones:

      Se muestra una tabla con los administradores, con opción a operar con ellos.],

    [Escenario principal:

      1. El Superadministrador elige la opción “Administradores” del menú principal.
      2. SGVac muestra al superadministrador una tabla con los administradores, con opción a operar con ellos.
    ],

    [Flujos alternativos:

      - A1: No existen administradores para mostrar.

        La secuencia A1 comienza en el punto 3 del escenario principal.
        4. SGVac comunica al superadministrador que no hay resultados y muestra el listado vacío.
        El escenario finaliza.
    ],
  ),
) <CU11>

#figure(
  image("Actividad/Listar Administradores.drawio.png", width: 100%),
  caption: [Diagrama de actividad: Listar Administradores],
)

#pagebreak()
#figure(
  caption: [Modificar Administrador],
  table(
    columns: 1fr,
    align: left,
    table.header([CU13 - Modificar Administrador]),

    [Resumen:

      Este caso de uso permite al superadministrador modificar un administrador existente en SGVac.
    ],

    [Actores: Superadministrador (primario).],

    [Personal involucrado y metas:

      Superadministrador: quiere modificar un administrador existente de forma rápida y confiable.],

    [Precondiciones:

      El superadministrador ejecutó con éxito el #enlace(<CU11>)[CU11 - Listar Administradores].],

    [Postcondiciones:

      Se modifica el administrador.],

    [Escenario principal:

      1. El superadministrador accede a la sección Administradores y selecciona un administrador existente para modificar.
      2. SGVac muestra al superadministrador un formulario para que modifique el correo electrónico y la empresa (activa) del postulante y/o ingrese una nueva contraseña junto con su confirmación.
      3. El superadministrador modifica el correo electrónico y la empresa del administrador y/o introduce una nueva contraseña junto con su confirmación.
      4. SGVac modifica el administrador y vuelve al #enlace(<CU11>)[CU11 - Listar Administradores].
    ],

    [Flujos alternativos:

      - A1: el superadministrador ingresa un correo vacío.

        La secuencia A1 comienza en el punto 3 del escenario principal.
        4. SGVac comunica al superadministrador que el correo no puede estar vacío.
        El escenario vuelve al punto 2.

      - A2: el superadministrador ingresa un correo en un formato no válido.

        La secuencia A2 comienza en el punto 3 del escenario principal.
        4. SGVac comunica al superadministrador que el texto ingresado no es un correo válido.
        El escenario vuelve al punto 2.

      - A3: el correo ya existe.

        La secuencia A3 comienza en el punto 3 del escenario principal.
        4. SGVac comunica al superadministrador que ya existe un administrador con ese correo.
        El escenario vuelve al punto 2.

      - A4: el superadministrador ingresa una nueva contraseña pero no su confirmación.

        La secuencia A4 comienza en el punto 3 del escenario principal.
        4. SGVac comunica al superadministrador que debe confirmar la contraseña.
        El escenario vuelve al punto 2.

      - A5: el administrador ingresa una contraseña con menos de 8 caracteres.

        La secuencia A5 comienza en el punto 3 del escenario principal.
        4. SGVac comunica al superadministrador que la contraseña debe tener al menos 8 caracteres.
        El escenario vuelve al punto 2.

      - A6: la contraseña y su confirmación no coinciden.

        La secuencia A6 comienza en el punto 3 del escenario principal.
        4. SGVac comunica al superadministrador que las contraseñas no coinciden.
        El escenario vuelve al punto 2.
    ],
  ),
) <CU13>

#figure(
  image("Actividad/Modificar Administrador.drawio.png", width: 100%),
  caption: [Diagrama de actividad: Modificar Administrador],
)

#pagebreak()
#figure(
  caption: [Borrar Administrador],
  table(
    columns: 1fr,
    align: left,
    table.header([CU14 - Borrar Administrador]),

    [Resumen:

      Este caso de uso permite al superadministrador borrar un administrador existente.
    ],

    [Actores: Superadministrador (primario).],

    [Personal involucrado y metas:

      Superadministrador: quiere borrar un administrador existente de forma rápida y confiable.],

    [Precondiciones:

      El superadministrador ejecutó con éxito el #enlace(<CU11>)[CU11 - Listar Administradores], y el administrador a borrar se encuentra en los resultados de búsqueda.],

    [Postcondiciones:

      Se borra el administrador.],

    [Escenario principal:

      1. El superadministrador ejecuta el #enlace(<CU11>)[CU11 - Listar Administradores] y elige la opción borrar el administrador elegido.
      2. SGVac muestra al superadministrador una confirmación del borrado del administrador.
      3. El superadministrador confirma el borrado.
      4. SGVac borra el administrador y vuelve al #enlace(<CU11>)[CU11 - Listar Administradores].
    ],

    [Flujos alternativos:

      - A1: el superadministrador no confirma el borrado del administrador.

        La secuencia A1 comienza en el punto 2 del escenario principal.
        3. El superadministrador decide no confirmar el borrado del administrador.
        El caso de uso termina.
    ],
  ),
) <CU14>

#figure(
  image("Actividad/Borrar Administrador.drawio.png", width: 100%),
  caption: [Diagrama de actividad: Borrar Administrador],
)

#pagebreak()
#figure(
  caption: [Listar Cuotas],
  table(
    columns: 1fr,
    align: left,
    table.header([CU15 - Listar Cuotas]),

    [Resumen:

      Este caso de uso permite al superadministrador listar las cuotas./* Una vez localizada la cuota, se puede operar con ella.*/],

    [Actores: Superadministrador (primario).],

    [Personal involucrado y metas:

      Superadministrador: quiere listar las cuotas de manera confiable.],

    [Precondiciones:

      El superadministrador ejecutó con éxito el #enlace(<CU01>)[CU01 - Iniciar Sesión Administrador].],

    [Postcondiciones:

      Se muestra una tabla con las cuotas/* , con opción a operar con ellas */.],

    [Escenario principal:

      1. El superadministrador elige la opción “Cuotas” del menú principal.
      2. SGVac muestra al administrador una tabla con las cuotas/* , con opción a operar con ellas */.
    ],

    [Flujos alternativos:

      - A1: No existen cuotas para mostrar.

        La secuencia A1 comienza en el punto 1 del escenario principal.
        2. SGVac comunica al superadministrador que no hay cuotas.
        El escenario finaliza.
    ],
  ),
) <CU15>

#figure(
  image("Actividad/Listar Cuotas.drawio.png", width: 100%),
  caption: [Diagrama de actividad: Listar Cuotas],
)

#pagebreak()
#figure(
  caption: [Listar Categorías],
  table(
    columns: 1fr,
    align: left,
    table.header([CU16 - Listar Categorías]),

    [Resumen:

      Este caso de uso permite al administrador listar las categorías de su empresa. Una vez localizada la categoría, se puede operar con ella.],

    [Actores: Administrador (primario).],

    [Personal involucrado y metas:

      Administradores: quieren listar las categorías para operar de forma rápida y confiable.],

    [Precondiciones:

      El administrador ejecutó con éxito el #enlace(<CU01>)[CU01 - Iniciar Sesión Administrador].],

    [Postcondiciones:

      Se muestra una tabla con las categorías, con opción a operar con ellas.],

    [Escenario principal:

      1. El Administrador elige la opción “Categorías” del menú principal.
      2. SGVac muestra al administrador una tabla con las categorías, con opción a operar con ellas.
    ],

    [Flujos alternativos:

      - A1: No existen categorías para mostrar.

        La secuencia A1 comienza en el punto 1 del escenario principal.
        2. SGVac comunica al administrador que no hay resultados y muestra el listado vacío.
        El escenario finaliza.
    ],
  ),
) <CU16>

#figure(
  image("Actividad/Listar Categorías.drawio.png", width: 100%),
  caption: [Diagrama de actividad: Listar Categorías],
)

// TODO: revisar. El código manda estado:A, nombre del formulario y orden (pero no hace ningún control al respecto).
#pagebreak()
#figure(
  caption: [Nueva Categoría],
  table(
    columns: 1fr,
    align: left,
    table.header([CU17 - Nueva Categoría]),

    [Resumen:

      Este caso de uso permite al administrador crear una nueva categoría dado el nombre y el orden (que no pueden estar duplicados). La crea en estado activo.],

    [Actores: Administrador (primario).],

    [Personal involucrado y metas:

      Administradores: quieren crear una nueva categoría de forma rápida y confiable.],

    [Precondiciones:

      El administrador ejecutó con éxito el #enlace(<CU01>)[CU01 - Iniciar Sesión Administrador].],

    [Postcondiciones:

      Se crea la categoría en el último lugar del orden en estado activa.],

    [Escenario principal:

      1. El administrador elige la opción de añadir desde el menú de categorías.
      2. El sistema muestra al administrador un formulario para que ingrese el nombre y orden de la categoría.
      3. El administrador introduce el nombre y el orden de la categoría.
      4. El sistema da de alta la categoría en estado activo y en el lugar del orden preferido.
    ],

    [Flujos alternativos:

      // TODO: el A1 es una mentira, a confesarse
      - A1: el administrador no ingresa el nombre de la categoría.

        La secuencia A1 comienza en el punto 3 del escenario principal.
        4. El sistema comunica al administrador que el nombre de la categoría es obligatorio.
        El escenario vuelve al punto 2.

      - A2: el nombre de la categoría ya existe.

        La secuencia A2 comienza en el punto 3 del escenario principal.
        4. El sistema comunica al administrador que el nombre de la categoría ya existe.
        El escenario vuelve al punto 2.
    ],
  ),
) <CU17>

#figure(
  image("Actividad/Nueva Categoría.drawio.png", width: 100%),
  caption: [Diagrama de actividad: Nueva Categoría],
)

/* hay que revisar bien este caso de uso porque en nuestro caso, modificar una categoría es un poco diferente... */

#pagebreak()
#figure(
  caption: [Modificar Categoría],
  table(
    columns: 1fr,
    align: left,
    table.header([CU18 - Modificar Categoría]),

    [Resumen:

      Este caso de uso permite al administrador modificar una categoría existente.],

    [Actores: Administrador (primario).],

    [Personal involucrado y metas:

      Administradores: quieren modificar una categoría existente de forma rápida y confiable.],

    [Precondiciones:

      El administrador ejecutó con éxito el #enlace(<CU16>)[CU16 - Listar Categorías].],

    [Postcondiciones:

      Se modifica la categoría.],

    [Escenario principal:

      1. El administrador accede a la sección Categorías y selecciona una categoría existente para modificar.
      2. SGVac muestra el formulario Editar Categoría con los datos actuales de la categoría.
      3. El administrador modifica uno o más campos de la categoría y presiona Guardar cambios.
      4. SGVac valida los datos ingresados, registra la actualización manteniendo el estado actual, confirma la operación y redirige al listado de categorías, mostrando la información actualizada.
    ],

    [Flujos alternativos:

      \
      - A1: el administrador no ingresa el nombre de la categoría.

        La secuencia A1 comienza en el punto 3 del escenario principal.
        4. El sistema comunica al administrador que el nombre de la categoría es obligatorio.
        El escenario vuelve al punto 2.

      \
      - A2: el nombre de la categoría ya existe.

        La secuencia A2 comienza en el punto 3 del escenario principal.
        4. El sistema comunica al administrador que el nombre de la categoría ya existe.
        El escenario vuelve al punto 2.

      \
      - A3: el orden es inválido.

        La secuencia A2 comienza en el punto 3 del escenario principal.
        4. El sistema comunica al administrador que el orden es inválido.
        El escenario vuelve al punto 2.
    ],
  ),
) <CU18>

#figure(
  image("Actividad/Modificar Categoría.drawio.png", width: 100%),
  caption: [Diagrama de actividad: Modificar Categoría],
)

#pagebreak()
#figure(
  caption: [Activar Categoría],
  table(
    columns: 1fr,
    align: left,
    table.header([CU19 - Activar Categoría]),

    [Resumen:

      Este caso de uso permite al administrador activar una categoría existente. La categoría tiene que estar inactiva.],

    [Actores: Administrador (primario).],

    [Personal involucrado y metas:

      Administradores: quieren activar una categoría existente de forma rápida y confiable.],

    [Precondiciones:

      El administrador ejecutó con éxito el #enlace(<CU16>)[CU16 - Listar Categorías].],

    [Postcondiciones:

      Se activa la categoría.],

    [Escenario principal:

      1. El administrador ejecuta el #enlace(<CU16>)[CU16 - Listar Categorías] y elige la opción activar de la categoría elegida.
      2. El sistema muestra al administrador una confirmación de la activación de la categoría.
      3. El administrador confirma la activación.
      4. El sistema activa la categoría y vuelve al #enlace(<CU16>)[CU16 - Listar Categorías].
    ],

    [Flujos alternativos:

      - A1: el administrador no confirma la activación de la categoría.

        La secuencia A1 comienza en el punto 2 del escenario principal.
        3. El administrador decide no confirmar la activación de la categoría.
        El caso de uso termina.

      - A2: la categoría ya está activa.

        La secuencia A2 comienza en el punto 3 del escenario principal.
        4. El sistema comunica al administrador que la categoría ya está activa.
        El caso de uso termina.
    ],
  ),
) <CU19>

#figure(
  image("Actividad/Activar Categoría.drawio.png", width: 100%),
  caption: [Diagrama de actividad: Activar Categoría],
)

#pagebreak()
#figure(
  caption: [Dar De Baja Categoría],
  table(
    columns: 1fr,
    align: left,
    table.header([CU20 - Dar De Baja Categoría]),

    [Resumen:

      Este caso de uso permite al administrador dar de baja una categoría existente./* Todas sus vacantes tienen que estar dadas de baja y la categoría no tiene que estar dada de baja ya. */],

    [Actores: Administrador (primario).],

    [Personal involucrado y metas:

      Administradores: quieren dar de baja una categoría existente de forma rápida y confiable.],

    [Precondiciones:

      El administrador ejecutó con éxito el #enlace(<CU16>)[CU16 - Listar Categorías].],

    [Postcondiciones:

      Se da de baja la categoría.],

    [Escenario principal:

      1. El administrador ejecuta el #enlace(<CU16>)[CU16 - Listar Categorías] y elige la opción dar de baja de la categoría elegida.
      2. El sistema muestra al administrador una confirmación de la baja de la categoría.
      3. El administrador confirma la baja.
      4. El sistema da de baja la categoría y vuelve al #enlace(<CU16>)[CU16 - Listar Categorías].
    ],

    [Flujos alternativos:

      - A1: el administrador no confirma la baja de la categoría.

        La secuencia A1 comienza en el punto 2 del escenario principal.
        3. El administrador decide no confirmar la baja de la categoría.
        El caso de uso termina.

      /* - A2: la categoría tiene alguna subcategoría activa.
      La secuencia A2 comienza en el punto 3 del escenario principal.
      4. El sistema comunica al administrador que el existen subcategorías activas de la categoría.
      El caso de uso termina. */

      - A2: la categoría ya está dada de baja.

        La secuencia A2 comienza en el punto 3 del escenario principal.
        4. El sistema comunica al administrador que la categoría ya está dada de baja.
        El caso de uso termina.
    ],
  ),
) <CU20>

#figure(
  image("Actividad/Dar De Baja Categoría.drawio.png", width: 100%),
  caption: [Diagrama de actividad: Dar De Baja Categoría],
)

// TODO: no verifica nada, que vergüenza
#pagebreak()
#figure(
  caption: [Borrar Categoría],
  table(
    columns: 1fr,
    align: left,
    table.header([CU21 - Borrar Categoría]),

    [Resumen:

      Este caso de uso permite al administrador borrar una categoría existente.],

    [Actores: Administrador (primario).],

    [Personal involucrado y metas:

      Administradores: quieren borrar una empresa existente de forma rápida y confiable.],

    [Precondiciones:

      El administrador ejecutó con éxito el #enlace(<CU16>)[CU16 - Listar Categorías].],

    [Postcondiciones:

      Se borra la categoría.],

    [Escenario principal:

      1. El administrador ejecuta el #enlace(<CU16>)[CU16 - Listar Categorías] y elige la opción de borrar la categoría elegida.
      2. El sistema muestra al administrador una confirmación de la eliminación de la categoría.
      3. El administrador confirma el borrado.
      4. El sistema borra la categoría y vuelve al #enlace(<CU16>)[CU16 - Listar Categorías].
    ],

    [Flujos alternativos:

      - A1: el administrador no confirma el borrado de la categoría.

        La secuencia A1 comienza en el punto 2 del escenario principal.
        3. El administrador decide no confirmar el borrado de la categoría.
        El caso de uso termina.
    ],
  ),
) <CU21>

#figure(
  image("Actividad/Borrar Categoría.drawio.png", width: 100%),
  caption: [Diagrama de actividad: Borrar Categoría],
)

#pagebreak()
#figure(
  caption: [Listar Vacantes],
  table(
    columns: 1fr,
    align: left,
    table.header([CU23 - Listar Vacantes]),

    [Resumen:

      Este caso de uso permite al postulante listar las vacantes publicadas por una empresa, aplicando filtro por categoría activa (por defecto: todas) y búsqueda por título. El listado se navega mediante carga incremental al hacer _scroll_ (paginación) y se muestra ordenado por fecha de publicación descendente.],

    [Actores: Postulante (primario).],

    [Personal involucrado y metas:

      Postulantes: quieren consultar las vacantes de una empresa de forma rápida y confiable.],

    [Precondiciones:

      No tiene.],

    [Postcondiciones:

      Se muestra una lista con las vacantes de la empresa que cumplan con el criterio de búsqueda, con opción a operar con ellas.],

    [Escenario principal:

      1. El Postulante accede a la sección Vacantes de la empresa.
      2. SGVac muestra el listado inicial de vacantes publicadas de la empresa, ordenadas por fecha de publicación descendente, junto con un selector de categorías activas (por defecto en “Todas las categorías”) y un cuadro de texto para búsqueda por título.
      3. El Postulante selecciona una categoría y/o ingresa un texto de búsqueda por título.
      4. SGVac actualiza el listado mostrando las vacantes que cumplan los criterios seleccionados.
      5. El Postulante se desplaza hacia el final del listado (_scroll_).
      6. SGVac carga la siguiente página de resultados y la agrega al listado.
    ],

    [Flujos Alternativos:

      - A1: No existen vacantes para mostrar (listado vacío inicial)

        La secuencia A1 comienza en el punto 1 del escenario principal.
        2. SGVac muestra el listado vacío e informa al Postulante que no hay vacantes disponibles.
        El escenario termina.

      /* - A2: Error al obtener el listado

      Comienza en los pasos 2, 4 o 6.
      SGVac informa al Postulante que ocurrió un error al obtener las vacantes.
      SGVac ofrece la opción Reintentar.
      Si el Postulante reintenta, SGVac repite el paso que falló.
      Fin (si el usuario cancela o el error persiste).
      Esto lo hace más “accionable” y no termina tan seco.

      - A3: No hay resultados para la categoría / búsqueda seleccionada

      Comienza en el paso 4.
      SGVac no encuentra vacantes que cumplan los criterios seleccionados.
      SGVac muestra un estado “Sin resultados” y ofrece Limpiar filtros/búsqueda.
      Si el Postulante limpia filtros, SGVac vuelve a mostrar el listado por defecto (volver al paso 2 o 4, según tu forma de describir).
      Fin.
      Este alternativo es distinto a “no existen vacantes” (porque sí puede haber vacantes, pero no para ese criterio).

      - A4: No hay más páginas para cargar (fin de paginación)

      Comienza en el paso 6.
      SGVac determina que no hay más resultados para cargar.
      SGVac detiene la carga incremental y (opcional) muestra “No hay más resultados”.
      El Postulante puede continuar operando con las vacantes ya cargadas.

      - A5: Búsqueda inválida (entrada demasiado corta / caracteres no permitidos)

      Comienza en el paso 3.
      El Postulante ingresa un texto de búsqueda inválido.
      SGVac informa el error de validación (por ejemplo: “Ingrese al menos X caracteres”) y no ejecuta la búsqueda.
      Retorna al paso 3.
      Este alternativo vale la pena si tu backend/frontend valida y devuelve 400 con issues (como venís haciendo con Zod).

      - A6: Categoría no disponible (inactiva o inexistente)

      Comienza en el paso 3 (o si la categoría llega preseleccionada desde URL).
      SGVac detecta que la categoría seleccionada no está activa/no existe.
      SGVac informa al Postulante y vuelve al filtro “Todas las categorías”.
      SGVac muestra el listado por defecto (paso 2 o 4).
      Fin. */
    ],
  ),
) <CU23>

#figure(
  image("Actividad/Listar Vacantes.drawio.png", width: 100%),
  caption: [Diagrama de actividad: Listar Vacantes],
)

#pagebreak()
#figure(
  caption: [Nueva Vacante],
  table(
    columns: 1fr,
    align: left,
    table.header([CU24 - Nueva Vacante]),

    [Resumen:

      Este caso de uso permite al administrador crear una nueva vacante para su empresa, asociándola a una categoría existente y activa. La vacante debe contar con un título, una descripción, un tipo de trabajo, una modalidad de trabajo y un nivel de experiencia (obligatorios). De manera opcional, puede incluir la localidad donde se desempeña el trabajo y una lista de habilidades deseadas para el puesto. La vacante puede crearse en estado Borrador o Publicado.],

    [Actores: Administrador (primario).],

    [Personal involucrado y metas:

      Administradores: quieren crear una vacante de forma rápida y confiable.],

    [Precondiciones:

      El administrador ejecutó con éxito el #enlace(<CU01>)[CU01 - Iniciar Sesión Administrador].],

    [Postcondiciones:

      Se crea una nueva vacante en estado Borrador o Publicado, según la acción seleccionada.],

    [Escenario principal:

      1. El administrador elige la opción de añadir desde el menú de vacantes.
      2. SGVac muestra al Administrador un formulario para ingresar categoría, título, descripción, tipo de trabajo, modalidad de trabajo, nivel de experiencia, localidad y habilidades deseadas.
      3. El Administrador completa los campos obligatorios y, de manera opcional, los campos adicionales.
      4. El Administrador selecciona la opción “Guardar como borrador” o “Publicar”.
      5. SGVac valida los datos ingresados, registra la vacante con estado Borrador o Publicado según la acción seleccionada, confirma la operación y muestra la vacante creada.
    ],

    [Flujos alternativos:

      - A1: El Administrador no completa uno o más campos obligatorios.

        La secuencia A1 comienza en el punto 3 del escenario principal.
        4. El Administrador selecciona “Guardar como borrador” o “Publicar”.
        5. SGVac comunica los campos obligatorios faltantes.
        El escenario vuelve al punto 2.

      \
      - A2: La categoría seleccionada no existe o se encuentra inactiva.

        La secuencia A2 comienza en el punto 4 del escenario principal.
        5. SGVac comunica al Administrador que la categoría seleccionada no es válida o se encuentra inactiva.
        El escenario vuelve al punto 2.

      - A3: No existen categorías activas para la empresa.

        La secuencia A3 comienza en el punto 2 del escenario principal.
        3. SGVac comunica al Administrador que no existen categorías activas y que debe crear o activar una categoría para poder crear vacantes.
        El escenario finaliza. // TODO: medio raro si con el a2 es suficiente

      - A4: Error al registrar la vacante.

        La secuencia A4 comienza en el punto 5 del escenario principal.
        6. SGVac comunica al Administrador que ocurrió un error al crear la vacante.
        El escenario finaliza. // TODO: este tampoco, porque en todos los CU puede pasar algo :S

      - A5: El Administrador cancela la creación de la vacante.

        La secuencia A5 comienza en el punto 2 o 3 del escenario principal.
        4. El Administrador abandona la pantalla sin guardar.
        5. SGVac no registra cambios.
        El escenario finaliza.
    ],
  ),
) <CU24>

#figure(
  image("Actividad/Nueva Vacante.drawio.png", width: 100%),
  caption: [Diagrama de actividad: Nueva Vacante],
)

#pagebreak()
#figure(
  caption: [Modificar Vacante],
  table(
    columns: 1fr,
    align: left,
    table.header([CU25 - Modificar Vacante]),

    [Resumen:

      Este caso de uso permite al administrador modificar una vacante propia existente de su empresa (en estado Borrador, Publicada o Cerrada), controlando /* que la categoría asociada esté activa y */ que la vacante tenga título.],

    [Actores: Administrador (primario).],

    [Personal involucrado y metas:

      Administradores: quieren modificar una vacante existente de forma rápida y confiable.],

    [Precondiciones:

      El administrador ejecutó con éxito el #enlace(<CU22>)[CU22 - Listar Vacantes Avanzado].],

    [Postcondiciones:

      Se modifica la vacante.],

    [Escenario principal:

      1. El Administrador accede a la sección Vacantes y selecciona una vacante existente para modificar.
      2. SGVac muestra el formulario Editar Vacante con los datos actuales de la vacante.
      3. El Administrador modifica uno o más campos de la vacante y presiona Guardar cambios.
      4. SGVac valida los datos ingresados, registra la actualización manteniendo el estado actual, confirma la operación y redirige al listado de vacantes, mostrando la información actualizada.
    ],

    [Flujos alternativos:

      // No hay validación de campos en ModificaVacante pero tendría que estar porque sino se romperían otras partes del código (por ejemplo una vacante que no tenga titulo)
      - A1: El Administrador no completa uno o más campos obligatorios (por ejemplo, título vacío o inválido).

        La secuencia A1 comienza en el punto 3 del escenario principal.
        4. SGVac comunica los errores de validación.// y mantiene al Administrador en el formulario de edición.
        El escenario vuelve al punto 2.

      /* y aquí si una categoría está inactiva, no aparece en el selector de categorías del editar vacante pero si ponemos en guardar cambios se guarda la misma categoría que ya tenía (medio raro).
      - A2: La categoría seleccionada no existe o se encuentra inactiva.
        La secuencia A2 comienza en el punto 3 del escenario principal.
        4. SGVac valida la categoría asociada y detecta que no es válida o se encuentra inactiva.
        5. SGVac comunica el error y mantiene al Administrador en el formulario de edición.
        El escenario vuelve al punto 2.

      //Este escenario es el pasaría si podemos una URL con una vacante que no existe, por ejemplo http://trabajo.com:5173/acme/categorias/desarrollo/vacantes/900/edit, en este caso el getOne falla y el backend manda un mensaje de Vacante no encontrada, pero esto aún no se refleja en el frontend. Queda un formulario vacío y nada más.
       - A3: La vacante no existe o no pertenece a la empresa del Administrador.
        La secuencia A3 comienza en el punto 1 del escenario principal.
        2. SGVac comunica que la vacante no existe o no se encuentra disponible para el Administrador.
        El escenario finaliza. */

      - A2: El Administrador no guarda los cambios en la vacante.

        La secuencia A2 comienza en el punto 3 del escenario principal. \ El escenario finaliza.
    ],
  ),
) <CU25>

#figure(
  image("Actividad/Modificar Vacante.drawio.png", width: 100%),
  caption: [Diagrama de actividad: Modificar Vacante],
)

#pagebreak()
#figure(
  caption: [Publicar Vacante],
  table(
    columns: 1fr,
    align: left,
    table.header([CU26 - Publicar Vacante]),

    [Resumen:

      Este caso de uso permite al administrador publicar una vacante de su empresa, cambiando su estado a Publicada desde Borrador o Cerrada (reapertura).],

    [Actores: Administrador (primario).],

    [Personal involucrado y metas:

      Administradores: quieren publicar una vacante de forma rápida y confiable.],

    [Precondiciones:

      El administrador ejecutó con éxito el #enlace(<CU22>)[CU22 - Listar Vacantes Avanzado].],

    [Postcondiciones:

      La vacante pasa al estado Publicada y se registra la fecha de publicación. Si la vacante estaba en estado Cerrada, se anula la fecha de cierre y se actualiza la fecha de publicación.],

    [Escenario principal:

      1. El Administrador accede al detalle (o edición) de una vacante de su empresa en estado Borrador o Cerrada.
      2. SGVac muestra el detalle de la vacante y la acción “Publicar”.
      3. El Administrador selecciona la acción “Publicar”.
      4. SGVac cambia el estado de la vacante a Publicada, registra la fecha de publicación y redirige al listado de vacantes, mostrando la información actualizada.
    ],

    [Flujos alternativos: No hay.

      // TODO: tiene varios. Pero todavía no están implementados.
      /*
      A1: Datos obligatorios incompletos // naaa no creo
      A2: La vacante ya está publicada // no es necesario?
      */
    ],
  ),
) <CU26>

#figure(
  image("Actividad/Publicar Vacante.drawio.png", width: 100%),
  caption: [Diagrama de actividad: Publicar Vacante],
)

#pagebreak()
#figure(
  caption: [Cerrar Vacante],
  table(
    columns: 1fr,
    align: left,
    table.header([CU27 - Cerrar Vacante]),

    [Resumen:

      Este caso de uso permite al administrador cerrar una vacante que está en estado Publicada.],

    [Actores: Administrador (primario).],

    [Personal involucrado y metas:

      Administradores: quieren cerrar una vacante de forma rápida y confiable.],

    [Precondiciones:

      El administrador ejecutó con éxito el #enlace(<CU22>)[CU22 - Listar Vacantes Avanzado].],

    [Postcondiciones:

      La vacante pasa al estado Cerrado, se registra la fecha de cierre y no se admiten más postulaciones.],

    [Escenario principal:

      1. El Administrador accede al detalle (o edición) de una vacante de su empresa en estado Publicada.
      2. SGVac muestra el detalle de la vacante y la acción “Cerrar”.
      3. El Administrador selecciona la acción “Cerrar”.
      4. SGVac cambia el estado de la vacante a Cerrada, registra la fecha de cierre y redirige al listado de vacantes, mostrando la información actualizada.
    ],

    [Flujos alternativos: No hay.],
  ),
) <CU27>

#figure(
  image("Actividad/Cerrar Vacante.drawio.png", width: 100%),
  caption: [Diagrama de actividad: Cerrar Vacante],
)

#pagebreak()
#figure(
  caption: [Borrar Vacante],
  table(
    columns: 1fr,
    align: left,
    table.header([CU28 - Borrar Vacante]),

    [Resumen:

      Este caso de uso permite al administrador borrar una vacante en borrador.],

    [Actores: Administrador (primario).],

    [Personal involucrado y metas:

      Administradores: quieren borrar una vacante de forma rápida y confiable.],

    [Precondiciones:

      El administrador ejecutó con éxito el #enlace(<CU22>)[CU22 - Listar Vacantes Avanzado].],

    [Postcondiciones:

      La vacante se borra.],

    [Escenario principal:

      1. El Administrador accede al detalle (o edición) de una vacante de su empresa en borrador.
      2. El Administrador selecciona la acción “Borrar”.
      3. SGVac borra la vacante y vuelve a #enlace(<CU22>)[CU22 - Listar Vacantes Avanzado].
    ],

    [Flujos alternativos: No hay.],
  ),
) <CU28>

#figure(
  image("Actividad/Borrar Vacante.drawio.png", width: 100%),
  caption: [Diagrama de actividad: Borrar Vacante],
)

#pagebreak()
#figure(
  caption: [Listar Postulantes],
  table(
    columns: 1fr,
    align: left,
    table.header([CU29 - Listar Postulantes]),

    [Resumen:

      Este caso de uso permite al administrador listar los postulantes que se postularon al menos una vez a vacantes de su empresa. Una vez localizado el postulante, se puede operar con él.],

    [Actores: Administrador (primario).],

    [Personal involucrado y metas:

      Administradores: quieren listar los postulantes que interactuaron con su empresa para operar sobre ellos de forma rápida y confiable.],

    [Precondiciones:

      El administrador ejecutó con éxito el #enlace(<CU01>)[CU01 - Iniciar Sesión Administrador].],

    [Postcondiciones:

      Se muestra una lista con los postulantes que se postularon a vacantes de la empresa al menos una vez, con opción a operar con ellos.],

    [Escenario principal:

      1. El administrador elige la opción “Postulantes” del menú principal.
      2. SGVac muestra al administrador una tabla con los postulantes que se postularon a vacantes de su empresa al menos una vez, con opción a operar con ellos.
    ],

    [Flujos Alternativos:

      - A1: No existen postulantes para mostrar.

        La secuencia A1 comienza en el punto 3 del escenario principal.
        4. SGVac comunica al administrador que no hay resultados y muestra el listado vacío.
        El escenario finaliza.
    ],
  ),
) <CU29>

#figure(
  image("Actividad/Listar Postulantes.drawio.png", width: 100%),
  caption: [Diagrama de actividad: Listar Postulantes],
)

#pagebreak()
#figure(
  caption: [Registrar Postulante],
  table(
    columns: 1fr,
    align: left,
    table.header([CU30 - Registrar Postulante]),

    [Resumen:

      Este caso de uso permite a una persona registrarse como Postulante en SGVac desde el sitio público de una empresa dada (según el _slug_ en la _URL_). Controla que el correo electrónico no se encuentre registrado previamente en la plataforma, y que la contraseña tenga al menos 6 caracteres y coincida con su confirmación. Luego registra al postulante en estado Pendiente y envía un correo electrónico de verificación con un enlace de activación de cuenta. Una vez activada la cuenta, el Postulante podrá iniciar sesión en cualquier empresa de la plataforma, independientemente del _slug_ desde el que se registró.],

    [Actores: Usuario (primario), firebase (secundario).],

    [Personal involucrado y metas:

      Usuarios: quiere registrarse como usuario Postulante a la plataforma SGVac de forma rápida y confiable.

      firebase: quiere que el correo electrónico y la _URL_ del mensaje sean correctos y no tenga código malicioso.],

    [Precondiciones:

      El usuario debe tener un correo electrónico y no debe ser usuario de SGVac ya.],

    [Postcondiciones:

      Se registra al usuario (con estado Pendiente) y se manda un correo electrónico al mismo para activar su cuenta.],

    [Escenario principal:

      1. El usuario elige la opción de registrarse como postulante de SGVac.
      2. SGVac muestra al usuario un formulario para que ingrese sus nombres, apellidos, correo electrónico, contraseña, confirmación, género y fecha de nacimiento.
      3. El usuario introduce los datos.
      4. SGVac da de alta al postulante en estado Pendiente y envía correo electrónico con enlace para activar la cuenta.
    ],

    [Flujos alternativos:

      - A1: el usuario no introduce alguno de los campos obligatorios.

        La secuencia A1 comienza en el punto 3 del escenario principal.
        4. SGVac comunica al usuario que faltan datos obligatorios. //los nombres, apellidos, correo electrónico, contraseña, confirmación, género y fecha de nacimiento son obligatorios.
        El escenario vuelve al punto 2.

      - A2: firebase no responde

        La secuencia A2 comienza en el punto 3 del escenario principal.
        4. SGVac comunica al usuario que firebase no responde.
        El caso de uso termina.

      - A3: el correo electrónico ya existe

        La secuencia A3 comienza en el punto 3 del escenario principal.
        4. SGVac comunica al usuario que el correo electrónico ya existe.
        El escenario vuelve al punto 2.

      - A4: el usuario introduce una contraseña con 5 caracteres o menos.

        La secuencia A4 comienza en el punto 3 del escenario principal.
        4. SGVac comunica al usuario que la contraseña debe tener al menos 6 caracteres.
        El caso vuelve al punto 2.

      - A5: la contraseña no coincide con su confirmación.

        La secuencia A5 comienza en el punto 3 del escenario principal.
        4. SGVac comunica al usuario que la contraseña no coincide con la confirmación.
        El caso vuelve al punto 2.

      /* - A6: la dirección de correo es inválida o inexistente

      La secuencia A6 comienza en el punto 3 del escenario principal.
      4. El Servidor Correo Electrónico comunica al Blog que la dirección de correo es inexistente o errónea.
      El caso vuelve al punto 2. */
    ],
  ),
) <CU30>

#figure(
  image("Actividad/Registrar Postulante.drawio.png", width: 100%),
  caption: [Diagrama de actividad: Registrar Postulante],
)

// ojo que no debemos modificar el correo de un usuario. Cambiaría el login por firebase.
#pagebreak()
#figure(
  caption: [Modificar Datos Perfil Postulante],
  table(
    columns: 1fr,
    align: left,
    table.header([CU31 - Modificar Datos Perfil Postulante]),

    [Resumen:

      Este caso de uso permite al postulante modificar sus datos de perfil: nombres, apellidos, cuil, género, fecha de nacimiento, localidad, teléfono y habilidades.],

    [Actores: Postulante (primario).],

    [Personal involucrado y metas:

      Postulantes: quieren modificar sus datos de perfil de forma rápida y confiable.],

    [Precondiciones:

      El postulante ejecutó con éxito el #enlace(<CU02>)[CU02 - Iniciar Sesión Postulante].],

    [Postcondiciones:

      Se modifican los datos de perfil del postulante.],

    [Escenario principal:

      1. El postulante accede a la sección “Mi perfil” de la empresa.
      2. SGVac muestra al postulante un formulario para que modifique sus nombres, apellidos, cuil, género, fecha de nacimiento, localidad, teléfono y/o habilidades.
      3. El postulante introduce sus datos.
      4. SGVac modifica los datos del postulante.
    ],

    [Flujos Alternativos:

      // TODO: que yo sepa, no verifica nada
      - A1: el usuario no introduce alguno de los campos obligatorios.

        La secuencia A1 comienza en el punto 3 del escenario principal.
        4. SGVac comunica al usuario que los nombres, apellidos, género y fecha de nacimiento son obligatorios.
        El escenario vuelve al punto 2.
    ],
  ),
) <CU31>

#figure(
  image("Actividad/Modificar Datos Perfil Postulante.drawio.png", width: 100%),
  caption: [Diagrama de actividad: Modificar Datos Perfil Postulante],
)

#pagebreak()
#figure(
  caption: [Activar Cuenta],
  table(
    columns: 1fr,
    align: left,
    table.header([CU32 - Activar Cuenta]),

    [Resumen:

      Este caso de uso permite al administrador activar un postulante existente.],

    [Actores: Administrador (primario).],

    [Personal involucrado y metas:

      Administradores: quieren activar un postulante existente de forma rápida y confiable.],

    [Precondiciones:

      El administrador ejecutó con éxito el #enlace(<CU29>)[CU29 - Listar Postulantes].],

    [Postcondiciones:

      Se activa el postulante.],

    [Escenario principal:

      1. El administrador elige la opción activar del postulante elegida.
      2. El sistema muestra al administrador una confirmación de la activación del postulante.
      3. El administrador confirma la activación.
      4. El sistema activa al postulante y vuelve al #enlace(<CU29>)[CU29 - Listar Postulantes].
    ],

    [Flujos alternativos:

      - A1: el administrador no confirma la activación del postulante.

        La secuencia A1 comienza en el punto 2 del escenario principal.
        3. El administrador decide no confirmar la activación del postulante.
        El caso de uso termina.
    ],
  ),
) <CU32>

#figure(
  image("Actividad/Activar Cuenta.drawio.png", width: 100%),
  caption: [Diagrama de actividad: Activar Cuenta],
)

#pagebreak()
#figure(
  caption: [Restablecer Contraseña],
  table(
    columns: 1fr,
    align: left,
    table.header([CU33 - Restablecer Contraseña]),

    [Resumen:

      Este caso de uso permite a los postulantes recuperar el acceso a su cuenta en caso de haber olvidado su contraseña. Para ello, el sistema envía un correo electrónico a la dirección registrada con una URL única que conduce al formulario de restablecimiento de credenciales.],

    [Actores:

      Postulante (primario), firebase (secundario).],

    [Personal involucrado y metas:

      Postulante: quiere recuperar el acceso a su cuenta de manera autónoma y segura sin perder su historial de postulaciones.

      Firebase: quiere que la dirección de destino sea válida para entregar el mensaje correctamente.],

    [Precondiciones:

      El postulante no ha iniciado sesión en el sistema. La cuenta del postulante debe existir y estar activa.],

    [Postcondiciones:

      Se envía un correo electrónico a la casilla del postulante con el enlace temporal para efectuar el cambio de contraseña.],

    [Escenario principal:

      1. El postulante selecciona la opción “¿Olvidaste tu contraseña?” en la pantalla de inicio de sesión.
      2. El sistema solicita el ingreso de la dirección de correo electrónico asociada a la cuenta.
      3. El postulante ingresa su correo electrónico y confirma la solicitud.
      4. El sistema verifica que el correo pertenezca a un usuario registrado y solicita a firebase el envío del enlace de recuperación.
      5. Firebase envía el correo a la dirección provista.
      6. El sistema informa al postulante que se ha enviado un correo con las instrucciones para restablecer su contraseña.
    ],

    [Flujos alternativos:

      - A1: el postulante no está activo.

        La secuencia A1 comienza en el punto 3 del escenario principal. \ El caso de uso termina.
    ],
  ),
) <CU33>

#figure(
  image("Actividad/Restablecer Contraseña.drawio.png", width: 100%),
  caption: [Diagrama de actividad: Restablecer Contraseña],
)

#pagebreak()
#figure(
  caption: [Listar Postulaciones de una Vacante],
  table(
    columns: 1fr,
    align: left,
    table.header([CU34 - Listar Postulaciones de una Vacante]),

    [Resumen:

      Este caso de uso permite al administrador consultar el listado de postulaciones asociadas a una vacante específica, dentro del contexto de su empresa. Al acceder, SGVac muestra las postulaciones vinculadas a la vacante seleccionada, incluyendo la información necesaria para revisar cada postulación y operar sobre ella según las acciones habilitadas en el panel.],

    [Actores: Administrador (primario).],

    [Personal involucrado y metas:

      Administradores: quieren consultar las postulaciones recibidas para una vacante específica, de forma rápida y confiable, dentro del contexto de su empresa.],

    [Precondiciones:

      El administrador ejecutó con éxito el #enlace(<CU22>)[CU22 - Listar Vacantes Avanzado].],

    [Postcondiciones:

      SGVac muestra una tabla con las postulaciones asociadas a la vacante seleccionada (en el contexto de su empresa) y su información relevante.],

    [Escenario principal:

      1. El administrador selecciona una vacante del listado de vacantes.
      2. SGVac muestra una tabla con las postulaciones asociadas a la vacante seleccionada (en el contexto de su empresa), con la información relevante.
    ],

    [Flujos Alternativos:

      - A1: No existen postulaciones para mostrar.

        La secuencia A1 comienza en el punto 2 del escenario principal.
        2. SGVac comunica al administrador que no hay resultados y muestra el listado vacío.
        El escenario finaliza.
    ],
  ),
) <CU34>

#figure(
  image("Actividad/Listar Postulaciones de una Vacante.drawio.png", width: 100%),
  caption: [Diagrama de actividad: Listar Postulaciones de una Vacante],
)

#pagebreak()
#figure(
  caption: [Listar Postulaciones de un Postulante],
  table(
    columns: 1fr,
    align: left,
    table.header([CU35 - Listar Postulaciones de un Postulante]),

    [Resumen:

      Este caso de uso permite al administrador consultar el listado de postulaciones asociadas a un postulante específico, dentro del contexto de su empresa. Al acceder, SGVac muestra las postulaciones vinculadas al postulante seleccionado, incluyendo la información necesaria para revisar cada postulación y operar sobre ella según las acciones habilitadas en el panel.],

    [Actores: Administrador (primario).],

    [Personal involucrado y metas:

      Administradores: quieren consultar las postulaciones realizadas por un postulante específico, de forma rápida y confiable, dentro del contexto de su empresa.],

    [Precondiciones:

      El administrador ejecutó con éxito el #enlace(<CU29>)[CU29 - Listar Postulantes].],

    [Postcondiciones:

      SGVac muestra una tabla con las postulaciones asociadas al postulante seleccionado (en el contexto de su empresa) y su información relevante.],

    [Escenario principal:

      1. El administrador selecciona un postulante de la tabla de postulantes.
      2. SGVac muestra una tabla con las postulaciones asociadas al postulante seleccionado (en el contexto de su empresa), con la información relevante.
    ],

    [Flujos Alternativos: No hay.],
  ),
) <CU35>

#figure(
  image("Actividad/Listar Postulaciones de un Postulante.drawio.png", width: 100%),
  caption: [Diagrama de actividad: Listar Postulaciones de un Postulante],
)

#pagebreak()
#figure(
  caption: [Listar Mis Postulaciones],
  table(
    columns: 1fr,
    align: left,
    table.header([CU36 - Listar Mis Postulaciones]),

    [Resumen:

      Este caso de uso permite al postulante consultar el listado de sus postulaciones dentro del contexto de una empresa. Al acceder, SGVac muestra las postulaciones vinculadas al postulante autenticado, incluyendo la información necesaria para revisar cada postulación según las opciones disponibles.],

    [Actores: Postulante (primario).],

    [Personal involucrado y metas:

      Postulantes: quieren consultar sus postulaciones de forma rápida y confiable dentro del sitio de una empresa, para revisar su historial y el estado de cada postulación.],

    [Precondiciones:

      El postulante ejecutó con éxito el #enlace(<CU02>)[CU02 - Iniciar Sesión Postulante].],

    [Postcondiciones:

      SGVac muestra una tabla con las postulaciones asociadas al postulante autenticado (en el contexto de la empresa) y su información relevante.],

    [Escenario principal:

      1. El postulante elige la opción “Mis postulaciones” del menú del sitio de la empresa.
      2. SGVac muestra una tabla con las postulaciones asociadas al postulante autenticado (en el contexto de la empresa), con la información relevante.
    ],

    [Flujos Alternativos:

      - A1: No existen postulaciones para mostrar.

        La secuencia A1 comienza en el punto 2 del escenario principal.
        2. SGVac comunica al postulante que no hay resultados y muestra el listado vacío.
        El escenario finaliza.
    ],
  ),
) <CU36>

#figure(
  image("Actividad/Listar Mis Postulaciones.drawio.png", width: 100%),
  caption: [Diagrama de actividad: Listar Mis Postulaciones],
)

#pagebreak()
#figure(
  caption: [Dar De Baja Postulación],
  table(
    columns: 1fr,
    align: left,
    table.header([CU38 - Dar De Baja Postulación]),

    [Resumen:

      Este caso de uso permite al postulante dar de baja una postulación.],

    [Actores: Postulante (primario).],

    [Personal involucrado y metas:

      Postulante: quiere dar de baja una postulación existente de forma rápida y confiable.],

    [Precondiciones:

      El postulante ejecutó con éxito el #enlace(<CU02>)[CU02 - Iniciar Sesión Postulante], y la postulación a dar de baja existe.],

    [Postcondiciones:

      Se borra la postulación.],

    [Escenario principal:

      1. El postulante ejecuta el #enlace(<CU36>)[CU36 - Listar Mis Postulaciones] y elige la opción dar de baja de la postulación elegida.
      2. El sistema muestra al postulante una confirmación de la baja de la postulación.
      3. El postulante confirma la baja.
      4. El sistema borra la postulación.
    ],

    [Flujos alternativos: No hay.],
  ),
) <CU38>

#figure(
  image("Actividad/Dar De Baja Postulación.drawio.png", width: 100%),
  caption: [Diagrama de actividad: Dar De Baja Postulación],
)

#pagebreak()
#figure(
  caption: [Ver currículum],
  table(
    columns: 1fr,
    align: left,
    table.header([CU39 - Ver currículum]),

    [Resumen:

      Este caso de uso permite al postulante autenticado visualizar o descargar su currículum vigente (si existe), junto con su información básica (nombre de archivo).],

    [Actores: Postulante (primario).],

    [Personal involucrado y metas:

      Postulantes: quieren visualizar el currículum que cargó a SGVac de forma rápida y confiable.],

    [Precondiciones:

      El postulante ejecutó con éxito el #enlace(<CU02>)[CU02 - Iniciar Sesión Postulante].],

    [Postcondiciones:

      El postulante visualiza o descarga el currículum vigente (si existe).],

    [Escenario principal:

      1. El postulante selecciona la opción “Ver currículum”.
      2. SGVac muestra el currículum en un visor y habilita su descarga.
    ],

    [Flujos Alternativos:

      - A1: El postulante no posee un currículum cargado.

        La secuencia A1 comienza en el punto 1 del escenario principal.
        2. SGVac ofrece la acción “Cargar currículum”.
        El caso de uso termina.

      /* - A2: Error al obtener el archivo.

      La secuencia A2 comienza en el punto 1 del escenario principal.
      2. SGVac informa error al recuperar el currículum.
      El caso de uso termina.*/
    ],
  ),
) <CU39>

#figure(
  image("Actividad/Ver currículum.drawio.png", width: 98%),
  caption: [Diagrama de actividad: Ver currículum],
)
