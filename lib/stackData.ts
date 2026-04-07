export interface TechItem {
  name: string
  iconUrl: string
  filter?: string
}

export interface StackCategory {
  id: string
  title: string
  items: TechItem[]
}

export const STACK_CATEGORIES: StackCategory[] = [
  {
    id: 'languages',
    title: 'Languages',
    items: [
      { name: 'Python', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' },
      { name: 'Java', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg' },
      { name: 'TypeScript', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg' },
      { name: 'JavaScript', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' },
      { name: 'HTML5', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg' },
      { name: 'CSS', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg' },
      { name: 'C', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg' },
      { name: 'C++', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    items: [
      { name: 'Django', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg', filter: 'brightness-200' },
      { name: 'Spring Boot', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg' },
      { name: 'FastAPI', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg' },
      { name: 'Next.js', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg', filter: 'brightness-200' },
      { name: 'Node.js', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg' },
      { name: 'Express', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg', filter: 'brightness-200' },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    items: [
      { name: 'Next.js', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg', filter: 'brightness-200' },
      { name: 'React', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' },
      { name: 'Tailwind', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' },
      { name: 'Framer Motion', iconUrl: 'https://cdn.simpleicons.org/framer' },
      { name: 'Shadcn UI', iconUrl: 'https://cdn.simpleicons.org/shadcnui', filter: 'brightness-200' },
      { name: 'TanStack Query', iconUrl: 'https://cdn.simpleicons.org/reactquery' },
      { name: 'Bootstrap', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg' },
    ],
  },
  {
    id: 'databases',
    title: 'Databases',
    items: [
      { name: 'PostgreSQL', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg' },
      { name: 'MongoDB', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg' },
      { name: 'Redis', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg' },
      { name: 'SQLite', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqlite/sqlite-original.svg' },
      { name: 'RDS', iconUrl: 'https://api.iconify.design/logos/aws-rds.svg' },
      { name: 'ElastiCache', iconUrl: 'https://api.iconify.design/logos/aws-elasticache.svg' },
    ],
  },
  {
    id: 'devops',
    title: 'DevOps & Cloud',
    items: [
      { name: 'Docker', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg' },
      { name: 'AWS', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },
      { name: 'S3', iconUrl: 'https://api.iconify.design/logos/aws-s3.svg' },
      { name: 'Azure', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg' },
      { name: 'Vercel', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg', filter: 'brightness-200' },
      { name: 'Nginx', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nginx/nginx-original.svg' },
      { name: 'Apache', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apache/apache-original.svg' },
      { name: 'GH Actions', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/githubactions/githubactions-original.svg' },
      { name: 'Railway', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/railway/railway-original.svg', filter: 'brightness-200' },
    ],
  },
  {
    id: 'tools',
    title: 'Tools',
    items: [
      { name: 'Git', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg' },
      { name: 'Linux', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg' },
      { name: 'NPM', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/npm/npm-original-wordmark.svg' },
      { name: 'Bruno', iconUrl: 'https://cdn.simpleicons.org/bruno' },
      { name: 'Turbopack', iconUrl: 'https://api.iconify.design/logos/turbopack.svg', filter: 'brightness-200' },
      { name: 'Zsh', iconUrl: 'https://cdn.simpleicons.org/zsh' },
      { name: 'Vite', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg' },
      { name: 'Bun', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bun/bun-original.svg' },
    ],
  },
]
