export interface Project {
  id: string
  name: string
  category: string
  description: string
  tags: string[]
  type: 'opensource' | 'personal' | 'collaborative'
  contribution?: string
  badge?: string
  liveUrl?: string
  repoUrl?: string
}

export const OPENSOURCE_PROJECTS: Project[] = [
  {
    id: 'pythainlp',
    name: 'PyThaiNLP',
    category: 'Open Source Security',
    description: 'Fixed a CodeQL-flagged ReDoS vulnerability in PyThaiNLP’s ULMFiT URL parser.',
    tags: ['Python', 'Security', 'CodeQL'],
    type: 'opensource',
    badge: 'Merged · PR #1400',
    repoUrl: 'https://github.com/PyThaiNLP/pythainlp/pull/1400',
  },
]

export const PERSONAL_PROJECTS: Project[] = [
  {
    id: 'mini-redis',
    name: 'Mini-Redis',
    category: 'Systems & Internals',
    description: 'High-performance in-memory key-value store from scratch in C, modeled after Redis internals.',
    contribution: 'Implemented a poll-based TCP server, RESP command parsing, an in-memory hash map, and append-only persistence with replay on startup.',
    badge: 'C networking · Storage internals',
    tags: ['C · POSIX', 'TCP/IP · poll()', 'RESP Protocol', 'Hash Map', 'AOF Persistence'],
    type: 'personal',
    repoUrl: 'https://github.com/chanitnan0jr/Mini-Redis',
  },
  {
    id: 'tpsystem',
    name: 'TPSystem',
    category: 'Mission-Critical Backend',
    description: 'A Spring Boot wallet engine for account creation and atomic money transfers, with PostgreSQL as the source of truth.',
    contribution: 'Built account creation and atomic transfers with ordered row locks, idempotent retries, debit/credit ledger entries, and transfer-rule tests.',
    badge: 'Wallet APIs · Transaction safety',
    tags: ['Java 21 · Spring Boot', 'PostgreSQL · JPA', 'Idempotency', 'Ledger', 'Testcontainers'],
    type: 'personal',
    repoUrl: 'https://github.com/chanitnan0jr/TPSystem',
  },
  {
    id: 'agriscanpro',
    name: 'AgriscanPro',
    category: 'Infrastructure & Product',
    description: 'End-to-end research management platform for agricultural data, built for real-world laboratory workflows.',
    contribution: 'Worked on role-based access, bulk sample ingestion, dashboard snapshots, NASA POWER cache fallbacks, and regression tests for data integrity.',
    badge: 'Research workflows · Backend reliability',
    tags: ['Django · DRF', 'React · TypeScript', 'PostgreSQL', 'AWS · S3', 'RBAC'],
    type: 'personal',
    repoUrl: 'https://github.com/GearJP2/agriscan-pro',
  },
  {
    id: 'specbot',
    name: 'SPEX-Shop',
    category: 'AI & RAG Systems',
    description: 'Thai smartphone spec assistant powered by RAG — scrapes real spec data and answers natural language queries in Thai.',
    contribution: 'Built Thai RAG retrieval with query expansion and reranking, added persistent chat history, and developed smartphone comparison and shopping flows.',
    badge: 'Thai RAG · Full-stack product',
    tags: ['Node.js · TypeScript', 'Next.js', 'MongoDB Atlas', 'Typhoon · RAG', 'Neural Reranking'],
    type: 'personal',
    liveUrl: 'https://spec-bot-steel.vercel.app/doc',
    repoUrl: 'https://github.com/chanitnan0jr/SPEX-Shop',
  },
  {
    id: 'agriscan-monitor',
    name: 'AgriScan Monitor',
    category: 'Infrastructure & Observability',
    description: 'Production infrastructure dashboard and real-time control panel for AgriScan Pro’s AWS services.',
    contribution: 'Implemented AWS metrics and cost views, scheduling controls, OAuth access checks, temporary STS credentials, and an isolated public demo mode.',
    badge: 'AWS operations · IAM hardening',
    tags: ['Next.js · TypeScript', 'AWS', 'CloudWatch', 'Cost Explorer', 'IAM · STS'],
    type: 'personal',
    repoUrl: 'https://github.com/chanitnan0jr/agriscan-monitor',
  },
  {
    id: 'super-ai-applied-lab',
    name: 'Super AI Engineer S6 — Applied AI Lab',
    category: 'Applied AI & Machine Learning',
    description: 'Independently developed Super AI Engineer Season 6 solutions across data storytelling, OCR, RAG, and a five-domain final mission.',
    contribution: 'Implemented all solutions: fire-data analysis, OCR extraction, Thai document retrieval, house recognition, word segmentation, sleep staging, heart-disease prediction, and Thai image captioning.',
    tags: ['Python · PyTorch', 'OCR · RAG', 'LightGBM · Optuna', 'Qwen2.5-VL'],
    type: 'personal', badge: 'Solo project · All solutions by me',
    repoUrl: 'https://github.com/chanitnan0jr/AIAT_Super_AI_Engineer_SS6',
  },
]

export const COLLABORATIVE_PROJECTS: Project[] = [
  {
    id: 'lms-obe-evidence',
    name: 'LMS To OBE Evidence Assistant',
    category: 'Education & AI-Assisted Authoring',
    description: 'A collaborative course-specification workspace for outcome-based education, with TQF3 drafting and instructor review.',
    contribution: 'Built the course-authoring flow and assessment review steps, added PDF-grounded AI drafts, improved PDF object matching, and wrote Thai user guides.',
    tags: ['React · TypeScript', 'FastAPI', 'GitHub Models', 'PDF · TQF3'],
    type: 'collaborative', badge: 'Team project · Course authoring & AI drafts',
    repoUrl: 'https://github.com/gold555555/Professor-Course-Administer',
  },
  {
    id: 'ntcir-semantic-retrieval',
    name: 'NTCIR-19 LIFELOG-7 CSAT',
    category: 'Semantic Video Retrieval',
    description: 'A collaborative research pipeline for retrieving relevant video moments from natural-language queries.',
    contribution: 'Added batched visual embeddings, resumable indexing, failure isolation, local boundary refinement, multi-scale sliding windows, and query-perturbation robustness checks.',
    tags: ['Python', 'PyTorch', 'FastAPI', 'Video Retrieval'],
    type: 'collaborative', badge: 'Team project · Retrieval & robustness',
    repoUrl: 'https://github.com/tewff14/NTCIR-19-CASTLE-TASK',
  },
  {
    id: 'sme-costmap',
    name: 'SME Observability — Costmap',
    category: 'FinOps & Observability',
    description: 'A Costmap proof of concept within the team observability stack, connecting cloud billing with CPU and memory usage.',
    contribution: 'Built the Costmap dashboard and FastAPI/DuckDB backend, added local ECS task-role simulation, and implemented compressed billing ingestion with CUR-style and FOCUS export data.',
    tags: ['FastAPI · DuckDB', 'Grafana', 'LocalStack S3', 'CUR · FOCUS'],
    type: 'collaborative', badge: 'Team project · Costmap / FinOps',
    repoUrl: 'https://github.com/KLAharris/sme-observability',
  },
]
