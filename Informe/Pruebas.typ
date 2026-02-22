#pagebreak()
= Pruebas

// === Introducción

Cada fase de desarrollo del Sistema de gestión de vacantes (SGVac) incluye una etapa de pruebas correspondiente al nivel de detalle en el que se encuentra el software. Estas pruebas se dividen en dos grandes categorías, de acuerdo con su orientación:

- Pruebas orientadas al desarrollo: Aquí se realizan tres tipos de pruebas clave. En primer lugar, las pruebas unitarias, que examinan unidades de código individuales (como componentes de React o funciones de controladores en el _backend_).

  A continuación, las pruebas de módulos, diseñadas para evaluar la funcionalidad de secciones completas del sistema (por ejemplo, el módulo de gestión de vacantes).

  Finalmente, se aplican pruebas de integración, que verifican la interacción y cohesión entre los distintos subsistemas (Frontend Administradores, Frontend Postulantes, Backend y Base de Datos).
- Pruebas orientadas al cliente: En este caso, se llevan a cabo pruebas de aceptación, donde se evalúa la funcionalidad global del sistema, asegurando que la estructura modular y las interacciones entre sus componentes cumplan con las especificaciones y requerimientos de los usuarios (Administradores y Postulantes).

== Test de unidades

=== Pruebas de caja blanca

Es un método de prueba que permite detectar errores internos en la lógica del código de cada módulo, examinando el funcionamiento interno del software.

Estas pruebas permiten garantizar que se ejercitan por lo menos una vez todos los caminos independientes de cada módulo, verificando que las decisiones lógicas (como la validación de roles o estados de vacantes) se evalúen correctamente en sus variantes verdadera y falsa. También se asegura que se ejecuten todos los bucles dentro de sus límites operacionales y que las estructuras internas de datos mantengan su validez.

En el contexto de este proyecto, el uso de TypeScript actuó como una primera barrera de pruebas de caja blanca estáticas, detectando inconsistencias de tipos en tiempo de compilación tanto en el _backend_ como en los _frontends_. Además, se realizaron pruebas manuales a medida que avanzaba el desarrollo de cada componente:

- _Backend_: Se verificó la lógica de los controladores (ej. `admin.js`, `auth.js`) asegurando que las respuestas _JSON_ tuvieran la estructura correcta.
- _Frontend_: Se probaron los componentes visuales (como `TarjetaVacante.tsx` o los formularios de `AdminCrud.tsx`) para asegurar que rendericen la información correctamente según el estado.

== Test de módulos

=== Pruebas de caja negra

En las pruebas de caja negra, se evalúa cada módulo como una unidad funcional independiente sin considerar su implementación interna. Para el SGVac, estas pruebas verifican que las entradas de datos (como la carga de una nueva vacante o el registro de un postulante) cumplan con todos los requisitos funcionales especificados y produzcan las salidas esperadas.

La atención se centra en la entrada y salida de información, generando un conjunto de condiciones que abarcan las diferentes variaciones de datos del dominio. Con esto, se detectaron y corrigieron errores en:

- Funciones incorrectas o ausentes: Por ejemplo, validar que un postulante no pueda aplicar dos veces a la misma vacante o que un administrador no elimine una categoría con vacantes activas.
- Errores en la interfaz: Verificando que los formularios de Material UI manejen correctamente los errores de validación (campos vacíos, formatos de email inválidos).
- Problemas en el acceso a datos: Asegurando que todas las operaciones _CRUD_ sobre MariaDB se realicen sin errores y manteniendo la integridad referencial.
- Errores de inicialización y finalización: Especialmente en la _API REST_ (Node.js y Express), verificando el correcto manejo de las conexiones a la base de datos y la gestión de sesiones mediante _tokens JWT_.

Para realizar estas pruebas, utilizamos datos representativos (empresas de prueba, vacantes con distintas fechas de cierre, currículums en formato PDF) y verificamos las salidas en cada caso. Los resultados demostraron que cada módulo cumple satisfactoriamente con los requisitos del sistema.

=== Prueba de estrés

En las pruebas de estrés, se analiza el comportamiento del sistema bajo condiciones de carga elevada. Este test es crítico para el portal de postulantes, que podría recibir un alto volumen de tráfico simultáneo.

En esta prueba, el sistema se sometió a una carga superior a la prevista, simulando múltiples conexiones simultáneas hacia la _API_ en Node.js. Gracias a la arquitectura no bloqueante de Node.js y la eficiencia de MariaDB, el sistema pudo manejar la concurrencia sin degradar significativamente el tiempo de respuesta. Se evaluó especialmente la carga y descarga de archivos (currículums), confirmando que el servidor gestiona adecuadamente el almacenamiento sin bloquear otras peticiones.

== Test de integración

Durante las pruebas de integración, se examina cómo interactúan los distintos módulos entre sí. Dado que el sistema se compone de tres piezas principales (Frontend Administradores, Frontend Postulantes y Backend), los errores pueden surgir en la comunicación entre ellas.

Se verificaron flujos completos que atraviesan todo el sistema:

1. Creación y Publicación: Un administrador crea una vacante en el panel (Frontend Admin) -> La vacante se guarda en MariaDB (Backend) -> La vacante aparece visible en el listado público (Frontend Postulantes).
2. Postulación: Un postulante se registra y aplica (Frontend Postulantes) -> La postulación se registra con el CV (Backend) -> El administrador ve al nuevo postulante en su dashboard (Frontend Admin).

Algunos problemas detectados y resueltos incluyeron:

- Inconsistencias en los formatos de fecha entre el cliente (React) y el servidor.
- Problemas de permisos (_CORS_) al comunicar los _frontends_ con la _API_.
- Validación de tokens de sesión compartidos o específicos por rol.

Se aplicó un enfoque de integración incremental, asegurando primero que el _Backend_ y la Base de Datos (MariaDB) se comunicaran correctamente, para luego integrar cada _Frontend_ por separado.

== Test de aceptación

// ==== Pruebas alfa y beta

- La prueba alfa: Fue conducida internamente en el entorno de desarrollo. Se utilizó el software simulando los roles de Superadministrador, Administrador de Empresa y Postulante. Se verificó el flujo completo de los casos de uso (ej. Nueva Vacante, Nueva Postulación) en un entorno controlado, registrando y corrigiendo errores de lógica y usabilidad antes de la entrega.
- La prueba beta: Se plantea para ser llevada a cabo en un entorno de preproducción. En esta etapa, usuarios externos (como docentes o compañeros actuando como gerentes de RRHH) utilizan el sistema sin la intervención directa de los desarrolladores. El objetivo es detectar problemas no previstos, validar que la interfaz sea intuitiva (especialmente el diseño _responsive_ para postulantes) y asegurar que el sistema satisface todos los requisitos funcionales y de rendimiento establecidos en la especificación.
