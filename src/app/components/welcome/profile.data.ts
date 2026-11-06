// Contenido basado en cv/CV_Wilder_Choque_Quispe.md.
export const projects = [
  {
    title: 'Portal Web UAGRM y CMS', category: 'Gestión de contenido institucional',
    description: 'Desarrollé el portal y su CMS para que más de 250 unidades de la universidad gestionen su propio contenido.',
    contribution: 'Implementé renderizado en servidor y caché en varias capas para preparar el sitio público ante picos de visitas.',
    stack: ['Angular', 'NestJS', 'SSR', 'Caché'],
  },
  {
    title: 'Seguimiento de trámites', category: 'Procesos administrativos',
    description: 'Desarrollé un sistema que reemplaza el seguimiento de documentos por correo.',
    contribution: 'Incorporé derivaciones entre funcionarios, estados de avance y evidencia de entrega para dar trazabilidad a cada trámite.',
    stack: ['Django', 'GraphQL', 'React'],
  },
  {
    title: 'Servicios Informix', category: 'Integración de sistemas',
    description: 'Construí una capa de servicios para que los sistemas nuevos consuman la base central Informix sin acceder a ella directamente.',
    contribution: 'Diseñé el control de acceso y la auditoría de esta integración institucional.',
    stack: ['Django', 'GraphQL', 'Informix', 'Auditoría'],
  },
  {
    title: 'Plugins para Moodle', category: 'Tecnología educativa',
    description: 'Amplié las funciones de Moodle con documentos compartidos, vigilancia de exámenes y exportación dinámica de notas.',
    contribution: 'Integré documentos compartidos sin modificar el núcleo y automaticé procesos cuidando la integridad de los datos.',
    stack: ['Moodle', 'PHP', 'Bases de datos relacionales'],
  },
];

export const skillGroups = [
  { title: 'Backend e integración', items: ['Python', 'Django / Django REST', 'GraphQL', 'PHP / Laravel', 'NestJS / Express', 'Java / Spring Boot', 'Celery'] },
  { title: 'Frontend y móvil', items: ['JavaScript / TypeScript', 'React', 'Angular', 'Vue.js', 'Tailwind / shadcn/ui', 'Flutter'] },
  { title: 'Infraestructura y datos', items: ['Docker / Docker Compose', 'Podman', 'Jenkins / Kubernetes', 'Nginx / Git', 'PostgreSQL / SQL / NoSQL', 'Redis / RabbitMQ', 'MinIO'] },
  { title: 'Seguridad y arquitectura', items: ['SSO', 'JWT RS256 / JWE', 'Permisos por rol / API Keys', 'Auditoría centralizada', 'Microservicios', 'Boilerplates reutilizables', 'Migración de sistemas legacy'] },
];

export const experiences = [
  {
    company: 'DTIC – UAGRM', role: 'Desarrollador Full Stack y líder de equipo',
    period: 'Nov. 2025 – Actualidad', description: 'Dirección de Tecnología de la Información y Comunicación',
    responsibilities: [
      'Lideré un equipo de 4 desarrolladores, revisando arquitecturas, estándares de código y políticas institucionales, y resolviendo dudas técnicas.',
      'Estandarizo proyectos con Django, GraphQL y REST, React 19, Vite y Tailwind, con SSO, permisos y bitácora compartidos.',
      'Integro autenticación JWT RS256, auditoría con RabbitMQ y permisos por rol en Redis.',
      'Despliego sistemas con Docker Compose, Podman, Jenkins y Kubernetes; participo en migraciones a Laravel 11 aplicando SOLID y patrones de diseño.',
      'Coordino requisitos con equipos multidisciplinarios y documento los avances técnicos.',
    ],
  },
  {
    company: 'DEDTE – UAGRM', role: 'Auxiliar en área de Desarrollo',
    period: 'Mar. 2025 – Oct. 2025', description: 'Departamento de Educación a Distancia y Tecnología Educativa',
    responsibilities: [
      'Desarrollé plugins para Moodle, incluidos documentos compartidos sin modificar su núcleo.',
      'Creé un plugin de vigilancia de exámenes con detección de actividad y captura de imágenes.',
      'Implementé exportación dinámica de notas y automaticé procesos administrativos cuidando la integridad de las bases de datos.',
    ],
  },
  {
    company: 'FICCT – UAGRM', role: 'Consejero de Carrera', period: 'Jul. 2022 – Jul. 2024',
    description: 'Experiencia extracurricular · Ingeniería Informática',
    responsibilities: [
      'Participé en la planificación estratégica y modificación del plan operativo anual.',
      'Formulé la programación académica y la carga horaria docente.',
      'Fiscalicé el cumplimiento académico docente y los estándares de calidad.',
    ],
  },
];
