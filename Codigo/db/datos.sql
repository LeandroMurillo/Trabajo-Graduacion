-- =========================
-- EMPRESAS
-- (mantengo idEmpresa fijo para que todo el seed sea determinista)
-- =========================
INSERT INTO proyecto.Empresas (idEmpresa, empresa, url, estilo, estado, esSistema) VALUES
(1, 'Plataforma', 'admin',  NULL, 'A', 1),
(2, 'Acme SA',    'acme',   '{"cssVariables":true,"palette":{"primary":{"main":"#1976d2"}}}', 'A', 0),
(3, 'Globex SRL', 'globex', '{"cssVariables":true,"palette":{"primary":{"main":"#9c27b0"}}}', 'A', 0),
(4, 'Initech',    'initech','{"cssVariables":true,"palette":{"primary":{"main":"#2e7d32"}}}', 'I', 0);

-- Asegura que el autoincrement no choque si más adelante insertás sin idEmpresa
ALTER TABLE proyecto.Empresas AUTO_INCREMENT = 5;

-- =========================
-- ADMINISTRADORES
-- (idAdministrador ahora es AUTO_INCREMENT -> NO se inserta)
-- =========================
INSERT INTO proyecto.Administradores (idEmpresa, email, clave, rol) VALUES
(1, 'superadmin@plataforma.com', '$2a$12$joA7IqSYVO4l8Y0IMvFD3.iwsqaml3Cl6uohDdt15pL7F.Vp29D9W', 'SUPERADMIN'),
(2, 'admin@acme.com',           '$2a$12$joA7IqSYVO4l8Y0IMvFD3.iwsqaml3Cl6uohDdt15pL7F.Vp29D9W', 'ADMIN'),
(3, 'admin@globex.com',         '$2a$12$joA7IqSYVO4l8Y0IMvFD3.iwsqaml3Cl6uohDdt15pL7F.Vp29D9W', 'ADMIN');

-- =========================
-- CUOTAS
-- (idCuota ahora es AUTO_INCREMENT y global -> NO se inserta idCuota)
-- =========================
-- Empresa Acme (idEmpresa = 2)
INSERT INTO proyecto.Cuotas (idEmpresa, monto, fechaPago) VALUES
(2, '12000', '2024-10-05'),
(2, '12000', '2024-11-05'),
(2, '12000', '2024-12-05'),
(2, '14000', '2025-01-05'),
(2, '15000', '2025-02-10'),
(2, '15000', '2025-03-10'),
(2, '16000', '2025-04-10'),
(2, '16000', '2025-05-10'),
(2, '16500', '2025-06-10'),
(2, '17000', '2025-07-10'),
(2, '17500', '2025-08-10'),
(2, '18000', '2025-09-10'),
(2, '18500', '2025-10-10'),
(2, '19000', '2025-11-10'),
(2, '19500', '2025-12-10'),
(2, '20000', '2026-01-10');

-- Empresa Globex (idEmpresa = 3)
INSERT INTO proyecto.Cuotas (idEmpresa, monto, fechaPago) VALUES
(3, '9000',  '2024-09-15'),
(3, '9000',  '2024-10-15'),
(3, '9500',  '2024-11-15'),
(3, '10000', '2024-12-15'),
(3, '10000', '2025-01-15'),
(3, '11000', '2025-02-15'),
(3, '11000', '2025-03-15'),
(3, '11500', '2025-04-15'),
(3, '12000', '2025-05-15'),
(3, '12500', '2025-06-15'),
(3, '13000', '2025-07-15'),
(3, '13500', '2025-08-15'),
(3, '14000', '2025-09-15'),
(3, '14500', '2025-10-15'),
(3, '15000', '2025-11-15'),
(3, '15500', '2025-12-15'),
(3, '16000', '2026-01-15');

-- Empresa Initech (idEmpresa = 4)
INSERT INTO proyecto.Cuotas (idEmpresa, monto, fechaPago) VALUES
(4, '18000', '2024-08-01'),
(4, '18000', '2024-09-01'),
(4, '18500', '2024-10-01'),
(4, '18500', '2024-11-01'),
(4, '20000', '2024-12-01'),
(4, '20000', '2025-01-01'),
(4, '20500', '2025-02-01'),
(4, '21000', '2025-03-01'),
(4, '21000', '2025-04-01'),
(4, '21500', '2025-05-01'),
(4, '22000', '2025-06-01'),
(4, '22500', '2025-07-01'),
(4, '23000', '2025-08-01'),
(4, '23500', '2025-09-01'),
(4, '24000', '2025-10-01'),
(4, '24500', '2025-11-01'),
(4, '25000', '2025-12-01'),
(4, '25500', '2026-01-01');

-- =========================
-- CATEGORIAS
-- (acá mantengo ids explícitos porque luego las Vacantes referencian idCategoria)
-- =========================
INSERT INTO proyecto.Categorias (idCategoria, idEmpresa, categoria, orden, estado) VALUES
(1,  2, 'Desarrollo',        1, 'A'),
(2,  2, 'Marketing',         2, 'A'),
(3,  2, 'Diseño',            3, 'A'),
(4,  2, 'Finanzas',          4, 'A'),
(5,  2, 'Recursos Humanos',  5, 'A'),
(6,  2, 'Data Science',      6, 'A'),
(7,  3, 'Logística y Distribución', 1, 'A'),
(8,  3, 'Ventas Internacionales',   2, 'A'),
(9,  3, 'Compras y Abastecimiento', 3, 'A'),
(10, 4, 'Legales y Compliance',     1, 'A'),
(11, 4, 'Infraestructura IT',       2, 'A'),
(12, 4, 'Consultoría de Negocios',  3, 'A'),
(13, 2, 'Atención al Cliente',      7, 'A');

ALTER TABLE proyecto.Categorias AUTO_INCREMENT = 14;

-- =========================
-- VACANTES
-- (idVacante ahora es AUTO_INCREMENT -> NO se inserta idVacante)
-- =========================
INSERT INTO proyecto.Vacantes
(idCategoria, idEmpresa, vacante, descripcion, tipoTrabajo, modalidad, fechaCreacion, fechaPublicacion, fechaCierre, localidad, nivelExperiencia, habilidades, estado)
VALUES
(1,2,'Desarrollador Frontend React','Responsable del desarrollo de interfaces modernas con React y MUI.','Tiempo Completo','Remoto','2025-09-01 00:00:00','2025-09-05 00:00:00',NULL,'Buenos Aires','SemiSenior','["React","JavaScript","HTML","CSS","MUI"]','P'),
(1,2,'Desarrollador Backend Node.js','Implementación de APIs REST con Express y MySQL.','Tiempo Completo','Híbrido','2025-08-20 00:00:00','2025-08-25 00:00:00',NULL,'Tucumán','Senior','["Node.js","Express","MySQL","REST"]','P'),
(1,2,'Full Stack Developer','Desarrollo integral de aplicaciones web usando React y Node.js.','Tiempo Completo','Remoto','2025-09-10 00:00:00','2025-09-15 00:00:00',NULL,'Córdoba','SemiSenior','["React","Node.js","APIs","Git"]','P'),
(1,2,'DevOps Engineer','Automatización de pipelines CI/CD y despliegue en cloud.','Tiempo Completo','Remoto','2025-09-15 00:00:00','2025-09-20 00:00:00',NULL,'Buenos Aires','Senior','["Docker","Kubernetes","CI/CD","Cloud"]','P'),
(1,2,'Desarrollador Python','Microservicios en Python con FastAPI.','Medio Tiempo','Remoto','2025-09-18 00:00:00','2025-09-22 00:00:00',NULL,'Rosario','Junior','["Python","FastAPI","SQLAlchemy","Testing"]','P'),
(1,2,'Ingeniero de Software C++','Software de alto rendimiento para sistemas embebidos.','Tiempo Completo','Presencial','2025-08-01 00:00:00','2025-08-05 00:00:00',NULL,'San Miguel de Tucumán','Senior','["C++","Linux","GCC","Git"]','P'),
(1,2,'QA Automation Engineer','Diseño de tests automatizados y control de calidad.','Tiempo Completo','Remoto','2025-09-05 00:00:00','2025-09-10 00:00:00',NULL,'Buenos Aires','SemiSenior','["Selenium","Cypress","Jest","Postman"]','P'),
(1,2,'Desarrollador Java','Sistemas empresariales con Spring Boot.','Tiempo Completo','Híbrido','2025-09-01 00:00:00','2025-09-04 00:00:00',NULL,'Mendoza','Senior','["Java","Spring Boot","JPA","MySQL"]','P'),
(1,2,'Data Engineer','Pipelines de datos en tiempo real.','Tiempo Completo','Remoto','2025-09-12 00:00:00','2025-09-17 00:00:00',NULL,'CABA','SemiSenior','["Python","Airflow","SQL","ETL"]','P'),
(1,2,'Desarrollador Móvil Flutter','Apps multiplataforma con Flutter y Firebase.','Tiempo Completo','Remoto','2025-09-20 00:00:00','2025-09-25 00:00:00',NULL,'Salta','Junior','["Flutter","Dart","Firebase","Git"]','P'),
(1,2,'Especialista en Ciberseguridad','Monitoreo y respuesta ante incidentes.','Tiempo Completo','Remoto','2025-09-10 00:00:00','2025-09-12 00:00:00',NULL,'Buenos Aires','Senior','["SIEM","Firewalls","Linux","IR"]','P'),
(1,2,'.NET Developer','Aplicaciones web con .NET Core.','Tiempo Completo','Presencial','2025-08-25 00:00:00','2025-08-30 00:00:00',NULL,'Tucumán','SemiSenior','["C#",".NET Core","Entity Framework","SQL Server"]','P'),
(1,2,'Game Developer Unity','Videojuegos y simulaciones con Unity.','Medio Tiempo','Remoto','2025-09-05 00:00:00','2025-09-08 00:00:00',NULL,'Córdoba','Junior','["Unity","C#","Git","Shaders (básico)"]','P'),
(1,2,'ML Engineer','Entrenamiento y despliegue de modelos.','Tiempo Completo','Remoto','2025-09-15 00:00:00','2025-09-18 00:00:00',NULL,'Buenos Aires','Senior','["Python","TensorFlow","scikit-learn","MLOps"]','P'),
(1,2,'DBA','Gestión y tuning de bases de datos.','Tiempo Completo','Híbrido','2025-08-10 00:00:00','2025-08-15 00:00:00',NULL,'Rosario','SemiSenior','["MySQL","PostgreSQL","Backup","Monitoring"]','P'),
(1,2,'Software Architect','Diseño de arquitectura escalable.','Tiempo Completo','Remoto','2025-09-01 00:00:00','2025-09-06 00:00:00',NULL,'CABA','Senior','["Microservicios","Cloud","CI/CD","Design Patterns"]','P'),
(1,2,'Desarrollador Angular','SPA con Angular y RxJS.','Tiempo Completo','Remoto','2025-09-02 00:00:00','2025-09-07 00:00:00',NULL,'Buenos Aires','SemiSenior','["Angular","TypeScript","RxJS","REST"]','P'),
(1,2,'Frontend Engineer Next.js','SSR y SEO con Next.js.','Tiempo Completo','Remoto','2025-09-08 00:00:00','2025-09-12 00:00:00',NULL,'CABA','SemiSenior','["Next.js","React","Node.js","SEO"]','P'),
(1,2,'Mobile Developer React Native','Apps nativas con React Native.','Tiempo Completo','Remoto','2025-09-10 00:00:00','2025-09-15 00:00:00',NULL,'Buenos Aires','Junior','["React Native","Redux","APIs REST"]','P'),
(1,2,'Desarrollador Backend Go','Servicios backend de alta concurrencia.','Tiempo Completo','Remoto','2025-09-05 00:00:00','2025-09-10 00:00:00',NULL,'Mendoza','Senior','["Go","gRPC","PostgreSQL","Concurrency"]','P'),
(2,2,'Especialista en Marketing Digital','Campañas 360° orientadas a performance.','Tiempo Completo','Híbrido','2025-09-01 00:00:00','2025-09-06 00:00:00',NULL,'Buenos Aires','SemiSenior','["Google Ads","Meta Ads","Analytics","SEO"]','P'),
(2,2,'Content Manager','Gestión del calendario editorial y lineamientos de marca.','Tiempo Completo','Remoto','2025-09-03 00:00:00','2025-09-08 00:00:00',NULL,'Córdoba','SemiSenior','["Copywriting","SEO On-Page","CMS","Analytics"]','P'),
(2,2,'Community Manager','Administración de redes y moderación de comunidades.','Medio Tiempo','Remoto','2025-08-28 00:00:00','2025-09-02 00:00:00',NULL,'Rosario','Junior','["Social Media","Canva","Hootsuite"]','P'),
(2,2,'Analista SEO/SEM','Optimización técnica/On-page y campañas de búsqueda.','Tiempo Completo','Remoto','2025-09-05 00:00:00','2025-09-10 00:00:00',NULL,'CABA','SemiSenior','["SEO Técnico","Google Ads","Search Console"]','P'),
(2,2,'Growth Marketer','Experimentos para adquisición y activación.','Tiempo Completo','Híbrido','2025-09-07 00:00:00','2025-09-12 00:00:00',NULL,'Buenos Aires','Senior','["A/B Testing","Funnels","SQL","Amplitude"]','P'),
(2,2,'Email Marketing Specialist','Automatizaciones y segmentación avanzada.','Tiempo Completo','Remoto','2025-08-30 00:00:00','2025-09-04 00:00:00',NULL,'Mendoza','SemiSenior','["HubSpot","Mailchimp","HTML/CSS","CRM"]','P'),
(2,2,'Paid Media Analyst','Optimización de campañas Paid Social y Display.','Tiempo Completo','Remoto','2025-09-09 00:00:00','2025-09-13 00:00:00',NULL,'Tucumán','Junior','["Meta Ads","DV360","Reporting","Excel"]','P'),
(2,2,'Brand Manager','Gestión integral de marca y posicionamiento.','Tiempo Completo','Presencial','2025-08-20 00:00:00','2025-08-26 00:00:00',NULL,'Buenos Aires','Senior','["Branding","Research","Presentaciones"]','P'),
(2,2,'PR & Comunicaciones','Relación con prensa/influencers y manejo de crisis.','Medio Tiempo','Híbrido','2025-09-11 00:00:00','2025-09-16 00:00:00',NULL,'Córdoba','SemiSenior','["PR","Influencers","Redacción"]','P'),
(2,2,'UX Writer','Microcopy orientado a conversión.','Tiempo Completo','Remoto','2025-09-12 00:00:00','2025-09-17 00:00:00',NULL,'CABA','SemiSenior','["UX Writing","Figma","Research"]','P'),
(2,2,'Analista de CRM','Journeys, segmentaciones y reporting.','Tiempo Completo','Híbrido','2025-09-13 00:00:00','2025-09-18 00:00:00',NULL,'Buenos Aires','SemiSenior','["Salesforce","HubSpot","SQL","ETL"]','P'),
(2,2,'Product Marketing Manager','Go-to-market, pricing y habilitación comercial.','Tiempo Completo','Híbrido','2025-09-14 00:00:00','2025-09-19 00:00:00',NULL,'Buenos Aires','Senior','["GTM","Research","Storytelling","Analytics"]','P'),
(2,2,'Marketing Analyst','Análisis de performance y tableros.','Tiempo Completo','Remoto','2025-09-01 00:00:00','2025-09-06 00:00:00',NULL,'Mendoza','Junior','["GA4","Looker Studio","Excel"]','P'),
(2,2,'Video Content Producer','Producción/edición de videos para campañas.','Medio Tiempo','Remoto','2025-09-02 00:00:00','2025-09-07 00:00:00',NULL,'Salta','Junior','["Premiere","After Effects","Guion"]','P'),
(2,2,'E-commerce Specialist','Catálogo, promos y conversión.','Tiempo Completo','Híbrido','2025-09-04 00:00:00','2025-09-09 00:00:00',NULL,'CABA','SemiSenior','["Mercado Shops","Shopify","CRO","Analytics"]','P'),
(2,2,'ASO Specialist','Optimización de stores y creatividades.','Medio Tiempo','Remoto','2025-09-06 00:00:00','2025-09-11 00:00:00',NULL,'Buenos Aires','SemiSenior','["ASO","Firebase","Testing Creativo"]','P'),
(2,2,'Marketing de Producto Jr.','Soporte a lanzamientos y materiales comerciales.','Tiempo Completo','Presencial','2025-08-29 00:00:00','2025-09-03 00:00:00',NULL,'San Miguel de Tucumán','Junior','["Briefs","Presentaciones","Coordinación"]','P'),
(2,2,'Eventos & Experiencias','Planificación y ejecución de eventos B2B/B2C.','Tiempo Completo','Híbrido','2025-09-08 00:00:00','2025-09-12 00:00:00',NULL,'Córdoba','SemiSenior','["Logística","Proveedores","Sponsorships"]','P'),
(2,2,'Performance Marketing Lead','Estrategia de performance multi-canal.','Tiempo Completo','Remoto','2025-09-10 00:00:00','2025-09-15 00:00:00',NULL,'Buenos Aires','Senior','["Atribución","Budgeting","Estrategia"]','P'),
(3,2,'Diseñador UX/UI','Diseño de interfaces centradas en el usuario.','Tiempo Completo','Remoto','2025-09-01 00:00:00','2025-09-05 00:00:00',NULL,'Buenos Aires','SemiSenior','["Figma","UX Research","Prototipado","UI Kits"]','P'),
(3,2,'Diseñador Gráfico','Materiales visuales para campañas y redes.','Medio Tiempo','Remoto','2025-09-03 00:00:00','2025-09-08 00:00:00',NULL,'Tucumán','Junior','["Photoshop","Illustrator","Canva"]','P'),
(3,2,'Diseñador Web','Landing pages y maquetado responsive.','Tiempo Completo','Remoto','2025-09-06 00:00:00','2025-09-10 00:00:00',NULL,'Córdoba','SemiSenior','["HTML","CSS","Figma","Bootstrap"]','P'),
(4,2,'Analista Contable','Registro contable y conciliaciones bancarias.','Tiempo Completo','Híbrido','2025-08-28 00:00:00','2025-09-02 00:00:00',NULL,'Buenos Aires','Junior','["Contabilidad","Excel","SAP","Análisis"]','P'),
(4,2,'Analista Financiero','Reportes financieros y control presupuestario.','Tiempo Completo','Remoto','2025-09-01 00:00:00','2025-09-06 00:00:00',NULL,'Córdoba','SemiSenior','["Finanzas","Excel Avanzado","Power BI"]','P'),
(4,2,'Asistente de Tesorería','Movimientos bancarios y flujo de caja diario.','Medio Tiempo','Presencial','2025-08-25 00:00:00','2025-08-30 00:00:00',NULL,'Tucumán','Junior','["Tesorería","Excel","Conciliaciones"]','P'),
(7,3,'Gerente de Centro de Distribución','Supervisión integral de operaciones logísticas y depósito.','Tiempo Completo','Presencial','2025-09-15 00:00:00','2025-09-18 00:00:00',NULL,'Córdoba','Senior','["SAP WM","Liderazgo","Logística","Inventarios"]','P'),
(7,3,'Analista de Inventarios','Control de stock cíclico y reportes de variaciones.','Tiempo Completo','Presencial','2025-09-16 00:00:00','2025-09-19 00:00:00',NULL,'Rosario','Junior','["Excel Avanzado","Control de Stock","ERP"]','P'),
(7,3,'Coordinador de Flota','Planificación de rutas y mantenimiento de unidades.','Tiempo Completo','Híbrido','2025-09-17 00:00:00','2025-09-20 00:00:00',NULL,'Buenos Aires','SemiSenior','["Logística","Ruteo","Geolocalización"]','P'),
(10,4,'Abogado Corporativo','Redacción de contratos y asesoría legal interna.','Tiempo Completo','Híbrido','2025-09-01 00:00:00','2025-09-06 00:00:00',NULL,'CABA','Senior','["Derecho Empresarial","Contratos","Compliance"]','P'),
(10,4,'Paralegal','Gestión de expedientes y trámites administrativos.','Medio Tiempo','Presencial','2025-09-03 00:00:00','2025-09-08 00:00:00',NULL,'Buenos Aires','Junior','["Investigación Legal","Redacción","Organización"]','P'),
(13,2,'Customer Success Manager','Asegurar la satisfacción y retención de clientes.','Tiempo Completo','Remoto','2025-09-20 00:00:00','2025-09-25 00:00:00',NULL,'Buenos Aires','Senior','["CRM","Inglés","Comunicación","Resolución"]','P'),
(13,2,'Agente de Soporte Bilingüe','Atención de tickets y chat en vivo.','Tiempo Completo','Remoto','2025-09-21 00:00:00','2025-09-26 00:00:00',NULL,'Córdoba','Junior','["Inglés Avanzado","Zendesk","Atención al Cliente"]','P'),
(13,2,'Líder de Atención al Cliente','Gestión de equipo de soporte y métricas.','Tiempo Completo','Híbrido','2025-09-22 00:00:00','2025-09-27 00:00:00',NULL,'Rosario','SemiSenior','["Liderazgo","KPIs","Coaching","Gestión"]','P');
