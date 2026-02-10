#pagebreak()
== Especificación D

=== Arquitectura de software

Para garantizar la escalabilidad y el mantenimiento del sistema, se ha seleccionado el patrón de diseño MVC (Modelo-Vista-Controlador). Esta arquitectura es fundamental para el desarrollo de la plataforma, ya que permite desacoplar la lógica de negocio de la interfaz de usuario, facilitando que múltiples empresas gestionen sus vacantes de forma independiente.

==== Modelo MVC (Modelo - Vista - Controlador)

El patrón MVC divide la aplicación en tres componentes interconectados, lo que permite un desarrollo más organizado y eficiente:

- Modelo: Es el componente que representa la estructura de datos y la lógica de negocio del sistema. En nuestro caso, el modelo gestiona las reglas para las entidades principales como Vacantes, Empresas, Categorías y Postulaciones. Es responsable de comunicarse con la base de datos para almacenar y recuperar información, asegurando, por ejemplo, que una categoría no se elimine si tiene vacantes asociadas.
- Vista: Se encarga de la presentación visual de la información. Dado que el sistema debe ser web _responsive_, la vista adapta el contenido para que sea accesible desde _tablets_, _smartphones_ y computadoras. Es aquí donde cada empresa tendrá su interfaz personalizada, dando la "ilusión" de que el sistema está hecho exclusivamente para ella.
- Controlador: Actúa como intermediario. Cuando un Administrador decide publicar una vacante o un Postulante envía su currículum, el controlador recibe esa entrada, procesa la solicitud invocando al modelo y determina qué vista mostrar al usuario como respuesta (por ejemplo, un mensaje de éxito o una lista actualizada).

=== Diseño del modelo lógico y físico de datos del sistema

==== Modelo relacional

// TODO

==== Arquitectura física del sistema

La arquitectura física del sistema se basa en un modelo Cliente-Servidor-Internet. Este enfoque es imprescindible dado que la plataforma es multiempresa y debe ser accesible globalmente tanto por los equipos de recursos humanos de las empresas clientes como por los postulantes.

En este esquema distribuido, los usuarios (clientes) interactúan con la aplicación a través de navegadores web sin necesidad de instalar software específico. Las solicitudes generadas por estos clientes (como filtrar vacantes o cargar un perfil) viajan a través de Internet hacia los servidores, donde se procesa la lógica y se accede a los datos.

Las ventajas de esta arquitectura para nuestro proyecto incluyen:

- Centralización: Los Superadministradores pueden gestionar globalmente el acceso y los recursos de las empresas desde un único punto.
- Escalabilidad: Permite que nuevas empresas se registren y operen sin afectar el rendimiento de las ya existentes.
- Mantenimiento: Las actualizaciones de seguridad o nuevas funcionalidades (como mejoras en el filtrado de vacantes) se despliegan en el servidor y están disponibles instantáneamente para todos los usuarios.