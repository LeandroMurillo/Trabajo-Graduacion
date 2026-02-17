#pagebreak()
= Modelo de ciclo de vida y metodología de desarrollo de software

El ciclo de vida del software es la estructura que nos permite organizar el desarrollo desde la idea inicial hasta que el sistema deja de utilizarse. Básicamente, define el orden de las etapas y qué criterios debemos cumplir para avanzar de una fase a otra.

Para el desarrollo del proyecto, la selección del modelo adecuado resulta fundamental. Sin una estructura clara, sería difícil planificar tiempos, estimar costos o coordinar el trabajo. El ciclo de vida nos da el marco necesario para asignar recursos y dirigir el proyecto de manera efectiva, garantizando que no solo escribamos código, sino que se construya una solución que responda realmente a la necesidad planteada.

La elección del modelo depende mucho del tipo de problema y del entorno. En nuestro caso, al tratarse de un sistema web con múltiples roles y requisitos de personalización, necesitamos un enfoque que nos permita adaptarnos a cambios y validar decisiones sobre la marcha.

== Selección de un modelo de ciclo de vida

Para el desarrollo del Sistema de gestión de vacantes de empleo, hemos elegido el modelo de prototipado evolutivo.

Esta decisión se basa en la necesidad de que los usuarios (tanto los administradores de las empresas como los postulantes) puedan ver y probar las funcionalidades del sistema desde temprano. Dado que la plataforma debe ser _responsive_ y ofrecer una experiencia personalizada para cada empresa cliente, no podemos esperar hasta el final para verificar si el diseño es el correcto.

Un prototipo es una versión preliminar del software que nos permite simular las funciones principales. Con el prototipado evolutivo, desarrollamos una versión inicial, la probamos, recibimos _feedback_ y la mejoramos en la siguiente iteración. Esto es ideal para nuestro proyecto porque:

- Nos ayuda a aclarar requisitos que quizás no están del todo definidos al principio.
- Permite verificar rápidamente si la interfaz se adapta bien a móviles y _tablets_.
- Reduce el riesgo de construir algo que no le sirva al usuario final.

El proceso que seguiremos adapta el modelo clásico a ciclos más cortos e iterativos:

1. Análisis inicial: Definimos los requisitos básicos (gestión de vacantes, categorías, perfiles).
2. Desarrollo del prototipo: Creamos una versión rápida enfocándonos en la interfaz y la funcionalidad clave.
3. Prueba y _Feedback_: Los usuarios interactúan con el sistema. Aquí validamos si el flujo de postulación es intuitivo o si los administradores pueden gestionar sus categorías fácilmente.
4. Refinamiento: Ajustamos el sistema basándonos en lo observado y repetimos el ciclo hasta llegar al producto final robusto.

== Selección de metodología de desarrollo de software

Como metodología de trabajo, utilizaremos V-Script.

Elegimos V-Script porque es una metodología dinámica que pone mucho énfasis en la interfaz de usuario y en la validación constante, lo cual encaja perfectamente con nuestro enfoque de prototipos.

El punto fuerte de esta metodología es cómo conecta el desarrollo con las pruebas (el famoso modelo en "V"). Cada cosa que diseñamos o programamos tiene una fase de prueba asociada. Esto es vital para nosotros porque manejamos distintos niveles de acceso (Superadministrador, Administrador, Postulante)  y necesitamos asegurar que cada rol funcione correctamente sin fallos de seguridad o lógica.

En resumen, V-Script nos permite:

- Centrarnos en el usuario: Al usar prototipos y maquetas, nos aseguramos de que el sistema cumpla con las expectativas visuales y funcionales de las empresas clientes.
- Asegurar la calidad: No dejamos las pruebas para el final. Verificamos cada componente a medida que lo construimos, lo que nos ahorra problemas graves en la etapa de implementación.

Esta combinación de prototipado evolutivo con V-Script nos da la flexibilidad para desarrollar la plataforma multiempresa que buscamos, garantizando al mismo tiempo un producto estable y bien probado.