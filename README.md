# localhost-v1

Personal portfolio website of **Chanitnan Kitnantakhun** — Backend / Systems Engineer.

Built with Next.js 14 App Router, React 18, TypeScript, and Tailwind CSS. Migrated from a static HTML/CDN setup to a fully component-based architecture.

## Detective theme

The homepage opens with a short push-in toward a laptop on a detective's desk, then reveals a noir hero with 52 unique playing cards orbiting a black detective silhouette. Scroll or select **Deal the cards** to shuffle six navigation cards. Each card keeps a fixed destination:

| Card | Destination                |
| ---- | -------------------------- |
| A♠   | Home — `/#home`            |
| K♠   | Projects — `/projects`     |
| Q♦   | Work — `/#work`            |
| J♣   | About — `/#about-detailed` |
| 10♠  | Terminal — `/#terminal`    |
| A♥   | Contact — `/#contact`      |

The scene uses layered 2.5D artwork and CSS transforms; it does not yet contain a WebGL character or a walkable cafe. The original portfolio sections follow the new terminal. Generated artwork is stored in `public/images/detective/`.

The intro appears once per browser session, can be skipped with its button or Escape, and is skipped for reduced motion and direct section links. Card animation can be paused, respects reduced motion, and stops when the hero or browser tab is not visible.

### Interactive terminal

The homepage terminal is a client-side portfolio command interface. Commands are allowlisted and do not execute a system shell:

- `help`, `whoami`, `ls`, `deck`, `history`, `date`, `clear`
- `cat about`, `cat projects`, `cat contact`
- `open home|projects|work|about|terminal|contact` (also `cd` and `goto`)
- Up/Down recall command history; Tab completes commands; Escape clears the input.

Project output comes from `lib/projectsData.ts`, and navigation uses the same card destinations.

---

## Tech Stack

| Layer           | Technology                                       |
| --------------- | ------------------------------------------------ |
| Framework       | Next.js 14 (App Router)                          |
| UI Library      | React 18                                         |
| Language        | TypeScript 5                                     |
| Styling         | Tailwind CSS 3 + custom Material Design 3 tokens |
| Package Manager | Bun                                              |
| Dev Bundler     | Turbopack                                        |
| Linting         | ESLint (next/core-web-vitals)                    |
| Deployment      | Vercel                                           |

---

## Project Structure

```
localhost-v1/
├── app/                        # Next.js App Router (routes)
│   ├── layout.tsx              # Root layout — <html>, <body>, Navbar, font, metadata
│   ├── page.tsx                # Home page (/)
│   ├── globals.css             # Global styles, CSS variables, Material Design 3 tokens
│   └── projects/
│       └── page.tsx            # Projects page (/projects)
│
├── components/
│   ├── home/                   # Section components used in app/page.tsx
│   │   ├── Hero.tsx            # Detective hero entry point
│   │   ├── ProfileGrid.tsx     # Profile image + engineering philosophy + social links
│   │   ├── About.tsx           # About me section
│   │   ├── LabResearch.tsx     # Tonkit Lab @ Thammasat University
│   │   ├── CoreStack.tsx       # Tech stack carousel / show-all toggle
│   │   ├── Workflow.tsx        # Work methodology accordion + sticky image
│   │   ├── Competitions.tsx    # PRAGMA 41 hackathon award
│   │   ├── Certifications.tsx  # AWS Academy + DataCamp certifications
│   │   └── GetInTouch.tsx      # CTA section with email / phone
│   ├── projects/               # Section components used in app/projects/page.tsx
│   │   ├── ProjectsHeader.tsx  # Page header with description
│   │   ├── ProjectCard.tsx     # Reusable card for each project
│   │   └── OpensourceCallout.tsx # Open source contribution callout
│   ├── layout/                 # Shared layout components
│   │   ├── Navbar.tsx          # Noir brand and primary navigation
│   │   └── Footer.tsx          # Footer (accepts variant prop: "full" | "minimal")
│   └── ui/                     # Reusable UI primitives
│       └── ImageModal.tsx      # Fullscreen image modal with animations
│
├── context/
│   └── ModalContext.tsx        # React context for global image modal state
│
├── hooks/
│   ├── useClock.ts             # Live HH:MM:SS clock (used in Navbar)
│   ├── useStackCarousel.ts     # Carousel state for CoreStack section
│   └── useToggle.ts            # Generic boolean toggle hook
│
├── lib/
│   ├── stackData.ts            # Tech stack data (categories, icons, DevIcons URLs)
│   └── projectsData.ts         # Projects data (opensource + personal)
│
├── public/
│   ├── images/                 # Static images served by next/image
│   │   ├── Profilepic.jpg
│   │   ├── Moutain.jpg
│   │   ├── Mascot.png
│   │   ├── workflow_bg.png
│   │   ├── PRAGMA41/
│   │   └── Datacamp/
│   └── Chanitnan_Kitnantakhun_Resume.pdf
│
├── next.config.mjs             # Next.js config — remote image domains (jsdelivr CDN)
├── tailwind.config.ts          # Tailwind config — custom colors, animations, fonts
├── tsconfig.json               # TypeScript config with @/ path alias
├── postcss.config.js           # PostCSS for Tailwind
└── package.json                # Scripts + dependencies
```

---

## Pages

### `/` — Home

Sections in order:

1. **Entry + Hero + Terminal** — Detective desk opening, 52-card orbit, shuffled navigation hand, and interactive command prompt
2. **ProfileGrid** — 7/5 column split: profile photo with gradient overlay, philosophy card, social links (GitHub, LinkedIn, Discord)
3. **About** — Background and motivation
4. **Lab Research** — Tonkit Lab @ Thammasat University (2025–Present)
5. **Core Stack** — Interactive tech stack with carousel and show-all modes. 6 categories: Languages, Backend, Frontend, Databases, DevOps & Cloud, Tools
6. **Workflow** — Accordion detailing 4-step engineering methodology (Architecture → Implementation → Testing → Deployment)
7. **Competitions** — PRAGMA 41 Hackathon 2026, Excellent Teamwork Award
8. **Certifications** — AWS Academy Cloud Developing, DataCamp (FastAPI, NumPy, Pandas, scikit-learn, Git)
9. **Get In Touch** — Contact CTA

### `/projects` — Projects

Grid of case studies split into:

- **Open Source** — PyThaiNLP (ReDoS vulnerability fix, PR #1400)
- **Personal** — Mini-Redis (C), TPSystem (Spring Boot), AgriscanPro (Django + React)

---

## Design System

Uses a noir palette with editorial typography for the new hero and terminal. The existing Material Design tokens remain available to the portfolio sections.

Key tokens:

| Token               | Value     | Usage                             |
| ------------------- | --------- | --------------------------------- |
| `background`        | `#0c0b0a` | Page background                   |
| `surface-container` | `#181613` | Card backgrounds                  |
| `accent-green`      | `#bca88c` | Champagne highlight, hover states |
| `on-surface`        | `#e5e2e1` | Primary text                      |
| `outline-variant`   | `#474747` | Borders                           |

Fonts are self-hosted in `app/fonts/`: **Cormorant Garamond** for editorial headings and navigation, **Inter** for body content, and **Material Symbols Outlined** for existing icons. Files come from Fontsource packages with their license texts included. The terminal uses the system monospace stack; font loading does not require Google Fonts.

Custom animations:

- `datacamp-scroll` — infinite horizontal scroll for certificate images
- `blink` — cursor blink effect

---

## Custom Hooks

| Hook               | Returns                       | Description                                          |
| ------------------ | ----------------------------- | ---------------------------------------------------- |
| `useClock`         | `string`                      | Live HH:MM:SS updated every second via `setInterval` |
| `useStackCarousel` | `{ activeIndex, next, prev }` | Carousel state and navigation for CoreStack          |
| `useToggle`        | `[boolean, () => void]`       | Simple boolean toggle                                |

---

## Data Layer

Content is decoupled from UI via typed data files in `lib/`:

- **`stackData.ts`** — exports `STACK_CATEGORIES: StackCategory[]` with tech name and DevIcons CDN URL per item
- **`projectsData.ts`** — exports `OPENSOURCE_PROJECTS` and `PERSONAL_PROJECTS` as typed `Project[]` arrays

Adding a new project or stack item requires only editing the data file, no component changes needed.

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed

### Install dependencies

```bash
bun install
```

### Run development server

```bash
bun run dev
```

Opens at [http://localhost:4000](http://localhost:4000) with Turbopack.

### Build for production

```bash
bun run build
bun run start
```

---

## Deployment

Deploy on **Vercel** — zero config required for Next.js projects.

```bash
vercel
```

Remote images from `cdn.jsdelivr.net` (DevIcons) are already whitelisted in `next.config.mjs`.

---

## Ignored Files

**`.gitignore`**

```
node_modules
```

**`bun.lock`** — Bun's lockfile (equivalent to `package-lock.json`). Committed to the repo to ensure deterministic installs across environments. Generated automatically by `bun install`.

---

## Migration Notes

This project was migrated from a static `index.html` + `projects.html` setup using Tailwind CDN and inline JavaScript. The migration involved:

- Extracting inline `<script>` blocks → React hooks (`useClock`, `useStackCarousel`, `useToggle`)
- Extracting inline `<style>` and Tailwind config → `tailwind.config.ts` + `globals.css`
- Converting each HTML section → typed React component with props
- Extracting hardcoded data → `lib/stackData.ts` and `lib/projectsData.ts`
- Moving `assets/images/` → `public/images/` for Next.js static serving
- Moving `assets/js/clock.js` → `hooks/useClock.ts`
