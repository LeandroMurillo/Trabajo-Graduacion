== Elección del lenguaje de programación <ElecProg>

=== Express.js

Express.js es el _framework_ web utilizado sobre Node.js para estructurar la _API REST_. Proporciona un mecanismo flexible para definir rutas (_endpoints_), gestionar peticiones _HTTP_ y organizar la lógica de negocio. Además, facilita la integración de _middlewares_ esenciales para la seguridad, como la validación de _tokens_ de sesión y el manejo de errores centralizado, permitiendo una arquitectura modular y escalable.

=== MariaDB

MariaDB se utiliza como sistema de gestión de bases de datos relacional (RDBMS) encargado de almacenar y organizar la información crítica del sistema, como usuarios, vacantes, empresas y postulaciones. Su estructura basada en tablas y relaciones garantiza la integridad referencial de los datos. El sistema aprovecha su capacidad para manejar transacciones y consultas complejas, asegurando que la información persistente sea consistente y segura.

// Se ha seleccionado MariaDB como el Sistema de Gestión de Bases de Datos Relacional (RDBMS). Es un fork comunitario de MySQL que ofrece alto rendimiento, estabilidad y características de seguridad robustas. En el proyecto, se despliega mediante contenedores Docker. Su compatibilidad con SQL estándar permite gestionar eficientemente las relaciones complejas entre postulantes, vacantes y empresas, asegurando la integridad referencial de los datos.

=== Node.js

Node.js es el entorno de ejecución utilizado en el _backend_. Su modelo de entrada/salida (I/O) no bloqueante y orientado a eventos permite gestionar múltiples conexiones simultáneas de manera eficiente, lo cual es vital para una plataforma que recibe solicitudes tanto de administradores gestionando vacantes como de postulantes aplicando a ofertas al mismo tiempo.

=== React.js

React es la librería utilizada para construir las interfaces de usuario tanto del panel de administración como del portal de postulantes. Su enfoque basado en componentes reutilizables permite desarrollar interfaces dinámicas que actualizan los datos en tiempo real sin necesidad de recargar la página completa. Esto ofrece una experiencia de navegación fluida y rápida para el usuario final.

=== TypeScript

TypeScript se emplea transversalmente en el proyecto para aportar robustez y seguridad al código. Al definir interfaces y tipos para los modelos de datos (como `Vacante`, `Postulante`, `Empresa`), se garantiza que tanto el _frontend_ como el _backend_ "hablen el mismo idioma", reduciendo drásticamente los errores en tiempo de ejecución y facilitando el mantenimiento del código a largo plazo.

=== JavaScript

JavaScript es el lenguaje de programación fundamental sobre el cual se construye todo el ecosistema tecnológico del proyecto. Su versatilidad permite ejecutar lógica tanto en el lado del cliente como en el del servidor, lo que garantiza una coherencia técnica en toda la pila de desarrollo. Al ser un lenguaje interpretado y altamente dinámico, facilita la creación de interfaces interactivas y la gestión de procesos asíncronos, elementos críticos para la comunicación fluida entre el portal de postulantes y la API. Además, su vasto ecosistema de bibliotecas y herramientas permite implementar soluciones modernas y eficientes para el manejo de datos y la experiencia de usuario.

== Frameworks y librerías

=== Backend

- Bcryptjs: Librería utilizada para el _hashing_ de contraseñas. Asegura que las credenciales de los administradores no se almacenen en texto plano en la base de datos, protegiendo la información sensible ante posibles vulnerabilidades.
- Cors: _Middleware_ que gestiona el intercambio de recursos de origen cruzado, permitiendo que los _frontends_ (alojados en distintos orígenes) puedan comunicarse de forma segura con la API del _backend_.
- Dotenv: Permite la gestión de variables de entorno, facilitando la configuración de credenciales de base de datos, claves secretas y puertos sin exponerlos directamente en el código fuente.
- Express: _Framework_ minimalista que estructura la aplicación del servidor, manejando el enrutamiento y el flujo de las peticiones _HTTP_.
- Firebase-admin: _SDK_ utilizado para la integración con los servicios de Firebase en el servidor, permitiendo la gestión de usuarios autenticados y la verificación de _tokens_ de seguridad para los postulantes.
- Jsonwebtoken: Implementación del estándar _JWT_ para la autenticación de usuarios. Se utiliza para generar y verificar _tokens_ de sesión, permitiendo un manejo de estado _stateless_ y seguro.
- Zod: Librería de declaración y validación de esquemas. Se utiliza para validar estrictamente los datos que llegan a la _API_ (cuerpos de solicitud, parámetros), asegurando que cumplan con los formatos esperados antes de ser procesados.

=== Frontend

El proyecto cuenta con dos aplicaciones _frontend_ (Administradores y Postulantes) que comparten tecnologías base pero utilizan librerías de interfaz específicas según sus necesidades:

- Firebase (_Client SDK_): Librería utilizada en el portal de postulantes para gestionar el flujo de autenticación (registro e inicio de sesión seguro) delegando esta responsabilidad a la plataforma de Google.
- Jwt-decode: Utilidad ligera para decodificar los _tokens JWT_ almacenados en el cliente y extraer información útil (como el rol o ID del usuario) sin necesidad de consultar al servidor.
- Material UI: Biblioteca de componentes robusta que implementa las guías de _Material Design_. Se utiliza para construir interfaces de gestión complejas, como tablas de datos y paneles de administración consistentes.
- React-router-dom: Gestiona la navegación declarativa dentro de la aplicación, permitiendo cambiar de vistas y manejar rutas protegidas sin recargar el navegador.
- TanStack Query: Potente librería para la gestión del estado asíncrono del servidor. Maneja el almacenamiento en caché, la sincronización y la actualización de datos en segundo plano, mejorando la eficiencia al evitar peticiones redundantes.
- Toolpad: Es una librería de nueva generación que facilita la creación rápida de interfaces de gestión interna (dashboards, CRUDs) integrándose de forma nativa con Material UI, acelerando el desarrollo de herramientas administrativas complejas.
- Vite: Entorno de desarrollo y empaquetador de próxima generación. Ofrece tiempos de arranque extremadamente rápidos y recarga en caliente, optimizando el flujo de trabajo del desarrollador.
- Zod: Se utiliza en el cliente para validar formularios y datos antes de enviarlos al servidor, proporcionando retroalimentación inmediata al usuario sobre errores de formato.

== Herramientas de desarrollo

- Docker y Docker Compose: Herramienta fundamental para la orquestación del entorno de desarrollo. El archivo compose.yml define y levanta los servicios necesarios (MariaDB, backend, frontend-postulantes, frontend-admin) en contenedores aislados, garantizando que todo el equipo trabaje con las mismas versiones y configuraciones.
- Eslint: Herramienta de análisis estático de código (linter) utilizada para identificar y reportar patrones problemáticos en JavaScript y TypeScript. Se implementó en todos los módulos del proyecto para asegurar la consistencia del estilo de codificación, detectar errores de sintaxis o lógica temprana y garantizar el cumplimiento de buenas prácticas, integrándose con reglas específicas para React en el frontend.
- Git & GitHub: Git se empleó como sistema de control de versiones para registrar el historial de cambios del código fuente. GitHub actuó como la plataforma de alojamiento remoto, facilitando la copia de seguridad y la gestión del repositorio.
- MySQL Workbench: Herramienta visual oficial para el diseño y administración de bases de datos MySQL y MariaDB. Se utilizó para modelar el esquema relacional, ejecutar consultas _SQL_ de prueba y administrar los datos almacenados durante el desarrollo.
- Visual Studio Code: Editor de código fuente ligero y potente. Gracias a su extenso ecosistema de extensiones, proporciona soporte integral para TypeScript, depuración de Node.js, y herramientas de formateo como Prettier, siendo el entorno principal de desarrollo.

== Herramientas de documentación

- Enterprise Architect / Herramientas CASE: Utilizadas para el modelado visual del software. Permitieron la creación de los diagramas _UML_ (Casos de Uso, Clases, Secuencia y Actividad) que describen la estructura y comportamiento del sistema antes de iniciar la codificación.
- ER/Studio: Herramienta de modelado de datos utilizada para el diseño del modelo relacional de la base de datos del sistema. Facilitó la creación de los diagramas que estructuran la información almacenada en MariaDB, permitiendo definir con precisión las tablas, atributos y restricciones de integridad referencial. Su uso fue clave para garantizar que el modelo de datos soporte eficientemente las relaciones entre postulantes, vacantes y empresas antes de proceder con la implementación técnica.
- Draw.io: Herramienta de diagramas utilizada para modelar visualmente la arquitectura del sistema y los flujos de casos de uso. Su versatilidad permitió crear representaciones claras de la estructura lógica y física del software.
- Typst: Sistema de composición tipográfica basado en marcado, diseñado para la creación de documentos científicos y técnicos de alta calidad. A diferencia de los procesadores de texto tradicionales, Typst permite estructurar el contenido mediante código, ofreciendo un control preciso sobre el diseño, las referencias bibliográficas y la generación de índices. Se utilizó para la redacción y maquetación de toda la documentación del proyecto, incluyendo este informe, aprovechando su eficiencia y rapidez de compilación para generar archivos PDF profesionales.
