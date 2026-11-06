// Se reutilizan los SVG locales; los logos adicionales se sirven desde Devicon.
const local = (name: string, file: string) => ({ name, icon: `assets/svgs/${file}.svg` });
const devicon = (name: string, folder: string, variant = 'original') => ({
  name,
  icon: `https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/${folder}/${folder}-${variant}.svg`,
});
const concept = (name: string, file: string) => local(name, file);

export const additionalSkills = {
  languages: [devicon('Java', 'java'), devicon('Go', 'go'), devicon('Rust', 'rust'), concept('NoSQL', 'database')],
  design: [
    devicon('Illustrator', 'illustrator', 'plain'), devicon('Photoshop', 'photoshop', 'plain'),
    local('Adobe InDesign', 'indesign'), devicon('After Effects', 'aftereffects'),
  ],
  frameworks: [
    devicon('Express.js', 'express'), devicon('Spring Boot', 'spring'),
    local('Django REST', 'django'), concept('Celery', 'tasks'),
    devicon('Flutter', 'flutter'), concept('shadcn/ui', 'components'),
    devicon('Moodle', 'moodle'), devicon('Vite', 'vitejs'),
  ],
  infrastructure: [
    local('Docker Compose', 'docker'), devicon('Podman', 'podman'),
    devicon('Jenkins', 'jenkins'), devicon('Kubernetes', 'kubernetes'),
    devicon('Nginx', 'nginx'), devicon('PostgreSQL', 'postgresql'),
    devicon('Redis', 'redis'), devicon('RabbitMQ', 'rabbitmq'), concept('MinIO', 'storage'), concept('Informix', 'database'),
  ],
  tools: [
    concept('Scrum', 'tasks'), concept('Planificación Gantt', 'tasks'),
    devicon('Trello', 'trello'), devicon('Jira', 'jira'),
  ],
};
