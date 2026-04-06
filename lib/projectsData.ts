export interface Project {
  id: string
  name: string
  category: string
  description: string
  achievement: string
  technicalEdge: string
  metric: string
  tags: string[]
  icon: string
  type: 'opensource' | 'personal'
  badge?: string
}

export const OPENSOURCE_PROJECTS: Project[] = [
  {
    id: 'pythainlp',
    name: 'PyThaiNLP',
    category: 'Open Source Contributions',
    description: 'Optimized performance-critical NLP routines by implementing Cython C-extensions.',
    achievement: 'Optimized performance-critical NLP routines by implementing Cython C-extensions (PR #1394).',
    technicalEdge: 'Achieved a 3–5x throughput increase by migrating Python loops to C. Engineered the extension with strict behavioral parity and type-safe boundaries, ensuring seamless integration with pure-Python fallbacks for legacy compatibility.',
    metric: '3.5x average speedup in character processing routines.',
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
    category: 'Systems & Internals',
    description: 'High-performance in-memory key-value store from scratch in C, modeled after Redis internals.',
    achievement: 'Engineered a high-performance, in-memory key-value store from scratch in C, modeled after the Redis internal architecture.',
    technicalEdge: 'Implemented an event-driven concurrency model using poll() for I/O multiplexing, eliminating thread context-switching overhead. Designed a custom hash map with dynamic resizing and guaranteed data durability through an Append-Only File (AOF) persistence engine utilizing atomic fsync syscalls.',
    metric: 'O(1) average lookup complexity with zero-busy-wait CPU overhead.',
    tags: ['C · POSIX', 'TCP/IP', 'RESP Protocol'],
    icon: 'memory',
    type: 'personal',
  },
  {
    id: 'tpsystem',
    name: 'TPSystem',
    category: 'Mission-Critical Backend',
    description: 'Banking transaction engine designed to solve complex concurrency failures and ensure absolute data integrity.',
    achievement: 'A transaction processing engine designed to solve complex concurrency failures and ensure absolute data integrity.',
    technicalEdge: 'Eliminated race conditions using ACID transactions and pessimistic locking with strict resource ordering to prevent deadlocks. Built a tamper-evident audit trail using cryptographic hash-chaining and implemented idempotency patterns to ensure consistency across network retries.',
    metric: '100% Transaction Accuracy under high-concurrency load testing.',
    tags: ['Spring Boot', 'PostgreSQL', 'Redis'],
    icon: 'account_balance',
    type: 'personal',
  },
  {
    id: 'agriscanpro',
    name: 'AgriscanPro',
    category: 'Infrastructure & Product',
    description: 'End-to-end research management platform for agricultural data, built for real-world laboratory workflows.',
    achievement: 'An end-to-end research management platform for agricultural data, built for real-world laboratory workflows.',
    technicalEdge: 'Architected a secure Hierarchical RBAC system across 6 distinct roles. Optimized high-volume data exports via server-side stream processing, reducing browser memory pressure by 70%. Orchestrated a cloud-native deployment using AWS (S3/CloudFront) with automated CI/CD pipelines.',
    metric: 'Deployed for real-world research use at Thammasat University.',
    tags: ['Django', 'React · TS', 'AWS'],
    icon: 'biotech',
    type: 'personal',
  },
]
