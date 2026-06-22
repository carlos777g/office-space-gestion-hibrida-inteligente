Escenario 1 - OfficeSpace: Gestión Híbrida Inteligente
1. Contexto del Cliente (El Escenario)
El Cliente: "Corporativo Alpha", una empresa multinacional que está transicionando a un modelo de trabajo híbrido (presencial/remoto).

El Problema: Actualmente gestionan la reserva de salas de juntas y espacios de trabajo ("Hot Desks") mediante un archivo de Excel compartido. Esto ha causado:

Duplicidad de reservas (dos equipos llegando a la misma sala)
Espacios subutilizados ("No-shows")
Falta de visibilidad sobre quién está en la oficina
Ausencia de control de acceso y permisos
Tu Misión (como Consultor Junior): Desarrollar un MVP (Producto Mínimo Viable) de una aplicación web que digitalice, automatice y optimice la gestión de espacios de Corporativo Alpha.

2. Requerimientos Funcionales (Lo que el sistema DEBE hacer)
2.1 Sistema de Autenticación y Roles
IMPORTANTE: El sistema debe implementar un mecanismo de autenticación básico que permita diferenciar entre roles. No se requiere un sistema de login robusto con encriptación avanzada, pero sí debe cumplir:

Requisitos Mínimos de Autenticación:
Login Simulado/Simplificado:

Pantalla de login con usuario y contraseña
Validación básica (puede ser contra datos hardcodeados o en BD)
Generación de token JWT simple para mantener sesión
Tiempo estimado: No más de 2-3 horas de desarrollo
Dos Roles Obligatorios:

Administrador: Acceso completo (CRUD de espacios + todas las funciones de Colaborador)
Colaborador: Solo puede buscar, reservar y gestionar sus propias reservas
Usuarios de Prueba Predefinidos:

Admin:
- Usuario: admin@corporativoalpha.com
- Password: Admin123
- Rol: ADMINISTRADOR

Colaboradores:
- Usuario: carlos.mendez@corporativoalpha.com / Password: User123 / Rol: COLABORADOR
- Usuario: ana.torres@corporativoalpha.com / Password: User123 / Rol: COLABORADOR
2.2 Módulo de Gestión (Rol: Administrador)
CRUD de Espacios: Capacidad de dar de alta salas o escritorios con atributos:

Nombre/ID
Tipo (Sala de juntas, Escritorio individual)
Capacidad (personas)
Recursos (¿Tiene proyector? ¿Tiene aire acondicionado?)
Piso/Ubicación
Dashboard de Ocupación: Vista rápida de qué espacios están ocupados el día de hoy

2.3 Módulo de Reserva (Rol: Colaborador)
Buscador de Disponibilidad: El usuario selecciona fecha y hora (inicio/fin) y el sistema muestra solo los espacios disponibles

Motor de Reservas (Lógica Crítica):

El sistema NO debe permitir reservas encimadas (overlapping) en el mismo espacio
El sistema debe validar que la fecha de reserva no sea en el pasado
El sistema debe validar que la capacidad solicitada no exceda la del espacio
"Mis Reservas": El usuario puede ver su historial y cancelar reservas futuras

2.4 Requisitos de Interfaz de Usuario (UI/UX)
IMPORTANTE: Se requieren MÍNIMO 4 pantallas funcionales para garantizar una experiencia completa:

Pantallas Obligatorias:
Pantalla de Login (Simulado)

Formulario simple con usuario/contraseña
Botón de "Iniciar Sesión"
Mensaje de error si credenciales inválidas
Redirección según rol después del login
Panel de Búsqueda con Filtros

Selector de fecha y rango horario
Filtros por tipo de espacio (Sala/Escritorio)
Filtro por capacidad mínima
Lista de resultados con disponibilidad en tiempo real
Botón "Reservar" por cada espacio disponible
Confirmación de Reserva

Resumen de la reserva (espacio, fecha, hora, capacidad)
Formulario para ingresar número de asistentes
Botón "Confirmar Reserva"
Mensaje de éxito/error
Opción de "Ver Mis Reservas"
Vista de Administración (Solo Admin)

Dashboard con ocupación del día
Tabla de espacios con opciones CRUD
Formulario para crear/editar espacios
Estadísticas básicas (opcional pero valorado)
Criterio de Evaluación UI:

Usabilidad > Estética: Se valora que la navegación sea intuitiva y los flujos estén completos
Responsive: Debe funcionar en desktop (mobile es opcional)
Feedback Visual: Mensajes claros de éxito/error en cada acción
3. Requerimientos Técnicos (Stack Tecnológico)
3.1 Arquitectura del Sistema
DECISIÓN ARQUITECTÓNICA EXPLÍCITA:

El sistema debe implementarse como Microservicios con Base de Datos Compartida (Arquitectura Híbrida). Esta decisión se toma considerando:

✅ Ventajas para el Hackathon:

Menor complejidad de configuración
Transacciones más simples entre servicios
Tiempo de desarrollo reducido
Facilita el debugging
📚 Aprendizaje de Conceptos:

Separación de responsabilidades por servicio
Comunicación entre servicios vía HTTP/REST
Despliegue independiente de servicios
Escalabilidad horizontal
Estructura de Servicios Requerida:
/officespace-starter-2026
│
├── /catalog-service          # Microservicio A: Gestión de Espacios
│   ├── /src
│   │   ├── /controllers
│   │   ├── /models
│   │   ├── /routes
│   │   └── /services
│   ├── package.json
│   ├── Dockerfile
│   └── README.md
│
├── /booking-service          # Microservicio B: Motor de Reservas
│   ├── /src
│   │   ├── /controllers
│   │   ├── /models
│   │   ├── /routes
│   │   ├── /services
│   │   └── /validators      # Validaciones críticas
│   ├── package.json
│   ├── Dockerfile
│   └── README.md
│
├── /auth-service             # Microservicio C: Autenticación (OPCIONAL)
│   └── (Si el equipo decide separar la autenticación)
│
├── /frontend                 # Aplicación Web
│   ├── /public
│   ├── /src
│   │   ├── /components
│   │   ├── /pages           # Las 4 pantallas mínimas
│   │   ├── /services        # API clients
│   │   └── /utils
│   ├── package.json
│   └── Dockerfile
│
├── /shared-infra             # Configuración Común
│   ├── init-db.sql          # Script de inicialización DB
│   └── /scripts
│
├── docker-compose.yml        # Orquestación de contenedores
└── README.md                 # Documentación principal
NOTA IMPORTANTE: Aunque los servicios comparten la misma base de datos PostgreSQL, cada servicio debe:

Tener su propio puerto y proceso independiente
Comunicarse con otros servicios vía HTTP (no acceso directo a funciones)
Poder desplegarse y escalarse de forma independiente
Tener su propio Dockerfile
3.2 Stack Tecnológico
Backend: Libre elección (Node.js, Python, Java, C#/.NET, Go)

Se valorará el uso de arquitecturas limpias (MVC, Hexagonal, etc.)
Obligatorio: Implementar middleware de autenticación JWT
Frontend: Libre elección (React, Angular, Vue, o HTML/CSS/JS puro)

Se valora la usabilidad (UX) más que la estética visual avanzada
Obligatorio: Implementar las 4 pantallas mínimas especificadas
Base de Datos: Relacional (MySQL/PostgreSQL/SQL Server) o NoSQL (MongoDB/Firebase)

Requisito: Debe existir un diagrama de entidad-relación (o esquema de documentos) lógico
Recomendado: PostgreSQL 15+ (incluido en el starter kit)
Repositorio: Todo el código debe estar en GitHub/GitLab con un historial de commits claro

3.3 Documentación de API (OBLIGATORIO)
NUEVO REQUISITO: Para facilitar la comunicación Dev-QA y la evaluación, se requiere:

Swagger/OpenAPI Specification:

Documentación interactiva de todos los endpoints
Debe estar accesible en /api-docs cuando se levante el proyecto
Incluir ejemplos de request/response para cada endpoint
Herramientas Aceptadas:

Swagger UI (Node.js: swagger-jsdoc + swagger-ui-express)
Springdoc (Java/Spring Boot)
FastAPI (Python - genera Swagger automáticamente)
NSwag (C#/.NET)
Contenido Mínimo de la Documentación:

Descripción de cada endpoint
Parámetros requeridos y opcionales
Códigos de respuesta HTTP (200, 400, 401, 404, 409, 500)
Modelos de datos (schemas)
Ejemplos de uso
Beneficio: QA puede comenzar a diseñar pruebas en paralelo al desarrollo, y los jueces pueden evaluar la API sin necesidad de leer código.

4. Starter Kit: OfficeSpace - Gestión Híbrida Inteligente
4.1 Estructura de Archivos Recomendada
/officespace-starter-2026
│
├── /catalog-service          # Microservicio A (Lista de salas/escritorios)
├── /booking-service          # Microservicio B (Motor de reservas y lógica)
├── /frontend                 # Aplicación Web React/Vue/Angular
├── /shared-infra             # Configuración común
│   └── init-db.sql          # Script de base de datos
├── /docs                     # Documentación técnica
│   ├── ARCHITECTURE.md      # Decisiones arquitectónicas
│   └── API_CONTRACT.md      # Contrato de API
├── docker-compose.yml        # Orquestación de contenedores
└── README.md                 # Manual de instrucciones
