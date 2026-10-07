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
    achievement: 'Resolved a regular-expression denial-of-service vulnerability in the ULMFiT preprocessing pipeline (PR #1400).',
    technicalEdge: 'Removed nested greedy quantification from URL matching to eliminate catastrophic backtracking while preserving the intended matching behavior.',
    metric: 'Linear-time worst-case URL matching after the security fix.',
    tags: ['Python', 'Security', 'CodeQL'],
    icon: 'security',
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
    achievement: 'Engineered a high-performance, in-memory key-value store from scratch in C, modeled after the Redis internal architecture.',
    technicalEdge: 'Implemented an event-driven concurrency model using poll() for I/O multiplexing, eliminating thread context-switching overhead. Designed a custom hash map with dynamic resizing and append-only persistence with fsync and startup replay.',
    metric: 'O(1) average lookup complexity with zero-busy-wait CPU overhead.',
    tags: ['C · POSIX', 'TCP/IP · poll()', 'RESP Protocol', 'Hash Map', 'AOF Persistence'],
    icon: 'memory',
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
    achievement: 'Implemented account creation and atomic, idempotent money-transfer APIs.',
    technicalEdge: 'Locks accounts in deterministic UUID order and writes balance changes, transfer results and debit/credit ledger entries in one transaction. Monetary values use integer minor units, with persisted idempotency keys for retries.',
    metric: 'Atomic transfers, persisted retry results and business-rule tests.',
    tags: ['Java 21 · Spring Boot', 'PostgreSQL · JPA', 'Idempotency', 'Ledger', 'Testcontainers'],
    icon: 'account_balance',
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
    achievement: 'An end-to-end research management platform for agricultural data, built for real-world laboratory workflows.',
    technicalEdge: 'Architected a secure Hierarchical RBAC system across 6 distinct roles. Optimized high-volume data exports via server-side stream processing, reducing browser memory pressure by 70%. Orchestrated a cloud-native deployment using AWS (S3/CloudFront) with automated CI/CD pipelines.',
    metric: 'Deployed for real-world research use at Thammasat University.',
    tags: ['Django · DRF', 'React · TypeScript', 'PostgreSQL', 'AWS · S3', 'RBAC'],
    icon: 'biotech',
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
    achievement: 'Built a full-stack RAG pipeline that scrapes Specphone.com, stores specs with vector embeddings in MongoDB Atlas, and answers Thai-language queries via a Next.js chat UI.',
    technicalEdge: 'Implemented multi-query expansion with Typhoon LLM and a neural Cross-Encoder reranker (ms-marco-MiniLM-L-6-v2) for high-precision retrieval. Engineered backend-first chat persistence with fire-and-forget DB writes, keeping response latency unaffected. Deployed on Azure App Service (backend) and Vercel (frontend) with automated monthly re-scraping via GitHub Actions.',
    metric: 'Full RAG pipeline with neural reranking deployed to production.',
    tags: ['Node.js · TypeScript', 'Next.js', 'MongoDB Atlas', 'Typhoon · RAG', 'Neural Reranking'],
    icon: 'smart_toy',
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
    achievement: 'Built an infrastructure dashboard for RDS, Elastic Beanstalk, and ElastiCache with Google OAuth access control.',
    technicalEdge: 'Enforced least-privilege IAM with an email allowlist for Server Actions. Wired Grafana and CloudWatch for P90/P99 latency, CPU saturation, memory, and FinOps cost tracking, then instrumented the system with OpenTelemetry.',
    metric: 'Production AWS monitoring with real-time control and health smoke tests.',
    tags: ['Next.js · TypeScript', 'AWS', 'CloudWatch', 'Cost Explorer', 'IAM · STS'],
    icon: 'monitoring',
    type: 'personal',
    repoUrl: 'https://github.com/chanitnan0jr/agriscan-monitor',
  },
  {
    id: 'super-ai-applied-lab',
    name: 'Super AI Engineer S6 — Applied AI Lab',
    category: 'Applied AI & Machine Learning',
    description: 'Independently developed Super AI Engineer Season 6 solutions across data storytelling, OCR, RAG, and a five-domain final mission.',
    contribution: 'Implemented all solutions: fire-data analysis, OCR extraction, Thai document retrieval, house recognition, word segmentation, sleep staging, heart-disease prediction, and Thai image captioning.',
    achievement: 'Completed three hackathon solutions and five final-mission notebooks independently.',
    technicalEdge: 'Combines retrieval/reranking, PyTorch vision and NLP models, LightGBM/Optuna and parameter-efficient vision-language fine-tuning.',
    metric: 'Three hackathon challenges and five final-mission domains.',
    tags: ['Python · PyTorch', 'OCR · RAG', 'LightGBM · Optuna', 'Qwen2.5-VL'],
    icon: 'psychology', type: 'personal', badge: 'Solo project · All solutions by me',
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
    achievement: 'Delivered course-specification editing and PDF-context drafting contributions within the team project.',
    technicalEdge: 'Integrated React authoring steps with FastAPI draft generation, compact CLO context and active-step rendering.',
    metric: 'Seven-step course-specification workflow with editable AI drafts.',
    tags: ['React · TypeScript', 'FastAPI', 'GitHub Models', 'PDF · TQF3'],
    icon: 'school', type: 'collaborative', badge: 'Team project · Course authoring & AI drafts',
    repoUrl: 'https://github.com/gold555555/Professor-Course-Administer',
  },
  {
    id: 'ntcir-semantic-retrieval',
    name: 'NTCIR-19 LIFELOG-7 CSAT',
    category: 'Semantic Video Retrieval',
    description: 'A collaborative research pipeline for retrieving relevant video moments from natural-language queries.',
    contribution: 'Added batched visual embeddings, resumable indexing, failure isolation, local boundary refinement, multi-scale sliding windows, and query-perturbation robustness checks.',
    achievement: 'Contributed retrieval and robustness improvements to the CASTLE video-retrieval pipeline.',
    technicalEdge: 'Configurable frames per segment, batched PyTorch inference and local visual-text similarity refinement with dtype handling.',
    metric: 'Retrieval, temporal boundary refinement and robustness evaluation tooling.',
    tags: ['Python', 'PyTorch', 'FastAPI', 'Video Retrieval'],
    icon: 'video_search', type: 'collaborative', badge: 'Team project · Retrieval & robustness',
    repoUrl: 'https://github.com/tewff14/NTCIR-19-CASTLE-TASK',
  },
  {
    id: 'sme-costmap',
    name: 'SME Observability — Costmap',
    category: 'FinOps & Observability',
    description: 'A Costmap proof of concept within the team observability stack, connecting cloud billing with CPU and memory usage.',
    contribution: 'Built the Costmap dashboard and FastAPI/DuckDB backend, added local ECS task-role simulation, and implemented compressed billing ingestion with CUR-style and FOCUS export data.',
    achievement: 'Delivered a local billing-to-utilization analytics prototype and Grafana dashboard.',
    technicalEdge: 'LocalStack S3 and IAM/STS credentials, csv.gz/manifest ingestion and cost/utilization queries served to Grafana.',
    metric: 'Local FinOps proof of concept with billing and utilization analytics.',
    tags: ['FastAPI · DuckDB', 'Grafana', 'LocalStack S3', 'CUR · FOCUS'],
    icon: 'monitoring', type: 'collaborative', badge: 'Team project · Costmap / FinOps',
    repoUrl: 'https://github.com/KLAharris/sme-observability',
  },
]
