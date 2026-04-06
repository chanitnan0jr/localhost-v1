export interface Project {
  id: string
  name: string
  description: string
  tags: string[]
  icon: string
  type: 'opensource' | 'personal'
  badge?: string
}

export const OPENSOURCE_PROJECTS: Project[] = [
  {
    id: 'pythainlp',
    name: 'PyThaiNLP',
    description:
      'Wrote C-extensions via Cython to optimize core NLP routines. Achieved a 3–5× speedup with a fully transparent pure-Python fallback for compatibility.',
    tags: ['Cython', 'C Extensions', 'Python'],
    icon: 'speed',
    type: 'opensource',
    badge: 'Open Source · PR #1394',
  },
]

export const PERSONAL_PROJECTS: Project[] = [
  {
    id: 'mini-redis',
    name: 'Mini-Redis',
    description:
      'Key-value store written in C from scratch. Custom hash map with O(1) ops, I/O multiplexing via poll() for single-threaded concurrency, and AOF persistence with fsync.',
    tags: ['C · POSIX', 'TCP/IP', 'RESP Protocol'],
    icon: 'memory',
    type: 'personal',
  },
  {
    id: 'tpsystem',
    name: 'TPSystem',
    description:
      'Banking transaction engine built to solve real concurrency bugs. ACID + Pessimistic Locking kills race conditions. Hash-chained audit trail makes tampering detectable. 2FA (TOTP) + Idempotency Keys round out the integrity model.',
    tags: ['Spring Boot', 'PostgreSQL', 'Redis'],
    icon: 'account_balance',
    type: 'personal',
  },
  {
    id: 'agriscanpro',
    name: 'AgriscanPro',
    description:
      'End-to-end agricultural research platform built with food scientists. RESTful API for mycotoxin sample tracking, RBAC across 6 roles, server-side filtered exports (CSV/Excel), and CI/CD on AWS CloudFront.',
    tags: ['Django', 'React · TS', 'AWS'],
    icon: 'biotech',
    type: 'personal',
  },
]
