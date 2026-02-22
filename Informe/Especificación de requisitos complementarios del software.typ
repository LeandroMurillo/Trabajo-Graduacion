#pagebreak()
= Especificación de requisitos complementarios del software // (ANSI/IEEE 830)

Esta especificación tiene como objetivo analizar y documentar las necesidades funcionales que deberán ser soportadas por el sistema a desarrollar. Para ello, se identificarán los requisitos que ha de satisfacer el nuevo sistema mediante entrevistas, el estudio de los problemas de las unidades afectadas y sus necesidades actuales. Además de identificar los requisitos se deberán establecer prioridades, lo cual proporciona un punto de referencia para validar el sistema final que compruebe que se ajusta a las necesidades del usuario.

== Identificación de los usuarios participantes

Los objetivos de esta tarea son identificar a los responsables de cada una de las unidades y a los principales usuarios implicados. En la organización se identificaron los siguientes usuarios:

- Gerente de empresa cliente: es el solicitante de la página web.
- Grupo de administradores de empresa: son los que se encargan de publicar las vacantes, agregar o modificar categorías de la empresa, y gestionar las postulaciones.
- Grupo de superadministradores: son las personas encargadas de gestionar la plataforma de empleos de forma global y gestionar el acceso de las empresas clientes a la plataforma.
- Grupo de postulantes: son las personas que están en condiciones legales de solicitar un empleo en el sitio de la empresa.

Cabe destacar la necesidad de una participación activa de los usuarios del futuro sistema en las actividades de desarrollo del mismo, con el objetivo de lograr la máxima adecuación del sistema a sus necesidades y facilitando su conocimiento progresivo, lo que permitirá una rápida implantación.

== Catálogo de requisitos del sistema

El objetivo de la especificación es definir en forma clara, precisa, completa y verificable todas las funcionalidades y restricciones del sistema que se desea construir. Esta documentación está sujeta a revisiones por el grupo de administradores que se recogerán por medio de sucesivas versiones del documento, hasta alcanzar su aprobación por parte del comité ejecutivo o gerentes de la empresa que solicita la página de internet. Una vez aprobado, servirá de base al equipo para la construcción del nuevo sistema.
Esta especificación se ha realizado de acuerdo al estándar "_IEEE Recommended Practice for Software Requirements Specifications_ (IEEE/ANSI 830-1993)".

== Objetivos y alcances del sistema

El proyecto consiste en desarrollar una plataforma de empleos multiempresa que brinde a las empresas clientes, recursos para ofrecer y administrar sus vacantes de empleo. Cada empresa a través de una aplicación _web responsive_ puede gestionar sus vacantes, las categorías a las que estas pertenecen y sus postulantes. Además, el sistema debe ofrecer una apariencia personalizada, de modo que la empresa perciba la plataforma como un entorno exclusivo.

Además debe permitir a las personas a registrarse como postulante, postularse a una o más vacantes, ver su historial de vacantes y modificar su perfil.

== Definiciones, acrónimos y abreviaturas

- Definiciones:
  - Vacante: es una oferta de trabajo publicada por el sitio web de la empresa.
  - Postulación: es la inscripción a la oferta de trabajo por parte del postulante que busca empleo.
  - _Web responsive_: hacer que un sitio web sea accesible y adaptable en todos los dispositivos: _tablets_, _smartphones_, etc.

- Abreviaturas:
  - API: _Application Programming Interface_
  - CORS: _Cross-Origin Resource Sharing_
  - CRUD: _Create, Read, Update, Delete_
  - CSS: _Cascading Style Sheets_
  - CU: Caso de Uso
  - HTML: _HyperText Markup Language_
  - HTTP: _HyperText Transfer Protocol_
  - IEEE: _Institute of Electrical & Electronics Engineers_
  - JS: JavaScript
  - JWT: _JSON Web Token_
  - MVC: Modelo Vista Controlador
  - PDF: _Portable Document Format_
  - REST: _Representational State Transfer_
  - SQL: _Structured Query Language_
  - UML: _Unified Modeling Language_

#pagebreak()
== Descripción general

Esta sección ofrece una descripción general del sistema con el propósito de identificar las funciones que debe soportar, los datos asociados, las restricciones impuestas y cualquier otro factor que pueda influir en su desarrollo.

La plataforma de empleos multiempresa será administrada globalmente por un equipo de superadministradores, quienes asignarán recursos a cada empresa cliente y delegarán autoridad a sus respectivos grupos de administradores para gestionar de forma independiente los sitios web de empleos de cada empresa.

Los superadministradores son responsables de gestionar el acceso de las empresas a la plataforma, asignando, modificando o retirando recursos según sea necesario. Cada empresa se registra con un nombre único, junto con la ruta asignada, y el estado de actividad (activa o inactiva).

Los administradores son los responsables de crear, modificar y eliminar tanto categorías como vacantes, además de revisar las postulaciones. Cada administrador de empresa define su propia estructura de clasificación para las vacantes disponibles, estableciendo categorías únicas dentro de su empresa. Cada categoría posee un nombre único y un orden específico en el que aparece en la interfaz de usuario. La interfaz está personalizada para cada empresa en la plataforma.

Cada categoría cuenta con un estado de actividad (activo o dado de baja), permitiendo un borrado lógico cuando una categoría ya no se utiliza. Las categorías que tengan vacantes asociadas no pueden ser eliminadas. Al cambiar su estado a “dado de baja”, estas categorías dejarán de aparecer en la clasificación de vacantes. La plataforma también debe ofrecer funcionalidad para gestionar las categorías.

Cuando un administrador crea una nueva vacante, esta se registra con los atributos: título, descripción, fecha de creación, fecha de publicación, fecha de cierre y estado. Inicialmente, la vacante tiene el estado "Borrador". Un administrador al publicarla en el sitio, cambia su estado a "Publicado". Una vez que el administrador ya no desea recibir más postulaciones, puede cerrar la vacante, marcándola con el estado "Cerrado".

Vacantes gestionadas por Postulantes:

Los postulantes podrán realizar la búsqueda de las vacantes publicadas en el sitio filtrando por categoría, título, y también dispondrán de un historial de vacantes aplicadas.

/* Vacantes gestionadas por Administradores:

Los administradores, además de contar con los mismos filtros que los postulantes, podrán filtrar las vacantes por estado (borrador, publicado, cerrado), nombre de usuario del postulante, cantidad de postulantes, y fecha de modificación. */

#pagebreak()
Grupo de Postulantes:

Los postulantes serán personas que tengan un correo electrónico, la posibilidad de ingresar al sitio y que estén en condiciones legales de acceder a una vacante; que cumpla la edad legal mínima y que sea una persona capaz bajo la ley.
Para registrarse en el sitio web de empleos de una empresa, primero, los postulantes deberán completar los siguientes datos: correo electrónico, contraseña, apellidos, nombres, fecha de nacimiento y género. Es importante que el usuario confirme estos datos antes de avanzar al siguiente paso de registro. La dirección de correo electrónico es obligatoria y única. La contraseña deberá tener una longitud mínima de 6 caracteres. Finalmente, se le enviará un correo electrónico a la dirección provista para activar la cuenta de usuario.

Una vez que un postulante se encuentre activo y habilitado para iniciar sesión, podrá cargar su currículum, editar sus datos personales, buscar y aplicar a vacantes según la categoría, y ver sus vacantes aplicadas.

Un postulante puede darse de baja por comportamiento inapropiado, contrario a las políticas de la empresa. El postulante pendiente es aquel que está en el proceso de registro y confirmación.

== Suposiciones y dependencias

- Suposiciones: Se asume que los requisitos descritos en este documento (gestión de vacantes, categorías y postulaciones) serán considerados estables una vez que sean aprobados por los responsables del proyecto y el tutor. Cualquier solicitud de cambio en las especificaciones funcionales deberá ser evaluada en función de su impacto en el cronograma y deberá contar con la aprobación de las partes involucradas antes de su implementación por el equipo de desarrollo.
- Dependencias:
  - Servicio de Autenticación de Terceros: El sistema depende de la disponibilidad de los servicios de Google Firebase para la autenticación y gestión segura de los usuarios del grupo "Postulantes".
  - Servicio de Correo Electrónico: Para cumplir con el requisito de activación de cuentas de postulantes mediante enlace de verificación, el sistema requiere acceso a un servidor SMTP o servicio de envío de correos transaccionales.
  - Conectividad: Dado que es una plataforma web distribuida, su funcionamiento depende enteramente de una conexión estable a Internet tanto en el servidor como en los clientes.

== Requisitos de usuario y tecnológicos

- Requisitos de usuario: Los usuarios del sistema se dividen en tres perfiles claros: Superadministradores, Administradores de Empresa y Postulantes. Las interfaces deben ser _responsive_ (adaptables), intuitivas y fáciles de navegar, permitiendo que un postulante sin conocimientos técnicos pueda registrarse y cargar su currículum sin necesidad de capacitación previa, y que los administradores puedan gestionar sus vacantes con una curva de aprendizaje mínima.
- Requisitos tecnológicos: La aplicación seguirá una arquitectura Cliente/Servidor sobre Internet.
  - Servidor: Deberá estar configurado para soportar el entorno de ejecución Node.js y el motor de base de datos MariaDB, dimensionado para gestionar múltiples conexiones concurrentes (especialmente ante picos de visitas en vacantes populares).
  - Cliente: La interfaz de usuario se ejecutará en el navegador web del cliente (Chrome, Firefox, Edge, Safari), comunicándose con el servidor mediante peticiones HTTP asíncronas (API REST).
- Disponibilidad: La aplicación deberá operar en un régimen de 24x7 para permitir que los postulantes apliquen a ofertas en cualquier momento.

== Requisitos de interfaces externas

- Interfaces de usuario: La interfaz gráfica debe cumplir estrictamente con el diseño _web responsive_, adaptándose automáticamente a la resolución del dispositivo. Esto es crítico para los postulantes, quienes accederán mayoritariamente desde dispositivos móviles, y para los administradores que podrían requerir gestionar urgencias desde tabletas o teléfonos.
- Interfaces _hardware_:
  - Dispositivos móviles: Pantalla táctil con resolución mínima de 360x640 píxeles.
  - Escritorio/_Laptop_: Pantalla con resolución mínima de 1366x768 píxeles (recomendado para la visualización de tablas de administración), teclado y dispositivo señalizador (_mouse_/_trackpad_).

- Interfaces software: El sistema requiere un navegador web compatible con los estándares de HTML5, CSS3 y JavaScript (ES6+). Para la visualización de los currículums (formato PDF), se dependerá de los visores integrados en el navegador del cliente.

== Requisitos de rendimiento

- Tiempo de respuesta: Las operaciones de lectura (listado de vacantes, categorías) no deberán superar los 3 segundos bajo condiciones normales de red. Las operaciones de escritura (carga de currículum, creación de vacante) no deberán superar los 10 segundos, dependiendo del ancho de banda del usuario para la subida de archivos.
- Concurrencia: El sistema debe ser capaz de soportar múltiples usuarios accediendo simultáneamente a las ofertas públicas sin degradar la experiencia de navegación.

== Requisitos de desarrollo

El ciclo de vida adoptado es el de Prototipado Evolutivo. El desarrollo se orientará a la creación de versiones incrementales del software, permitiendo validar primero la gestión de usuarios y empresas, luego la administración de vacantes y finalmente el proceso de postulación. El código debe ser modular (MVC) para facilitar la incorporación de nuevas funcionalidades o cambios en la lógica de negocio sin afectar la estabilidad del sistema.

== Restricciones de diseño

- Ajuste a estándares: La especificación de requisitos se basa en el estándar IEEE 830. El desarrollo del código sigue estándares modernos de JavaScript/TypeScript y el patrón de diseño MVC.
- Seguridad:
  - Las contraseñas de los administradores se almacenarán encriptadas utilizando algoritmos de _hash_ robustos (Bcrypt).
  - La autenticación de postulantes se delegará a Firebase para garantizar estándares de seguridad de la industria.
  - El acceso a los recursos de la _API_ se controlará mediante _tokens_ de sesión (JWT) y _middlewares_ de validación de roles.

- Política de Respaldo: Se establece una política de respaldo completo semanal de la base de datos MariaDB y de los archivos almacenados (currículums), complementada con respaldos incrementales diarios.
- Política de Borrado: Se implementará una política de borrado lógico para entidades críticas. Por ejemplo, las categorías no se eliminarán físicamente de la base de datos si tienen vacantes asociadas, sino que cambiarán su estado a "Dada de baja" para mantener la integridad histórica de los datos.
