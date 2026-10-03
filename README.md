# localhost-v1

Personal portfolio of **Chanitnan Kitnantakhun**, Backend / Systems Engineer.
Built with Next.js 14 App Router, React 18, TypeScript, Tailwind CSS 3, and Framer Motion.

## Run locally

```sh
bun install --frozen-lockfile
bun run dev
```

Development runs at `http://localhost:4000`.
Production: `bun run build`, then `bun run start`.

## Code map

| Directory | Responsibility |
| --- | --- |
| `app/` | Layout, home, projects, interactive terminal 404 |
| `app/api/` | Visitor tracking, live statistics, terminal system info |
| `components/` | Home sections, project cards, navigation/footer, image dialog |
| `components/detective/` | Skippable desk intro, 52-card hero, navigation hand, home terminal |
| `hooks/` | Local clock, boolean toggles, stack carousel state |
| `context/` | Shared image dialog state |
| `lib/` | Typed content, Redis client factory, visitor identity/tracking |
| `public/images/` | Static photos and certificates |
| `scripts/check.cjs` | Small rendering, card, terminal, and visitor checks using Node assertions |

`/` displays the portfolio; `/projects` displays case studies.
Unmatched routes (including `/dev/null`) display a simulated terminal. Commands do
not execute a shell or make arbitrary network requests.

## Detective theme

The home page opens on a detective's desk, zooms into the laptop, and reveals a
2.5D noir hero with 52 unique playing cards. The intro runs once per browser session;
Skip intro or Escape dismisses it. Direct section links and reduced motion skip it.
Card animation pauses manually, offscreen, and when the browser tab is hidden.

Scroll or select **Deal the cards** to reveal six navigation cards. Shuffling changes
their order while preserving these destinations:

| Card | Destination |
| --- | --- |
| A♠ Home | `/#home` |
| K♠ Projects | `/projects` |
| Q♦ Work | `/#work` |
| J♣ About | `/#about-detailed` |
| 10♠ Terminal | `/#terminal` |
| A♥ Contact | `/#contact` |

The home terminal supports `help`, `whoami`, `ls`, `deck`, `history`, `date`, `clear`,
`cat about|projects|contact`, and `open home|projects|work|about|terminal|contact`.
`cd` and `goto` are navigation aliases. Up/Down recalls history, Tab completes
commands, and Escape clears input. Project output uses `lib/projectsData.ts`.
The original portfolio sections follow the terminal.

## Optional visitor statistics

Set these server-only values in `.env.local`:

```env
UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

Without Redis the portfolio works and the visitor badge is hidden.
Visitor identity is approximately IP + OS, using trusted proxy headers.
`/api/visitors` returns live statistics with caching disabled.

## Verify changes

```sh
bun run lint
bun run typecheck
bun run check
bun run build
```

The same scripts work with `npm run`. Inter, Cormorant Garamond, and Material Symbols
are bundled locally with their licenses, so builds do not download fonts.
Stack icons still load from a CDN. No new dependencies are required for the theme.

Thai implementation notes are local in [docs/README.md](docs/README.md).
Historical reports are in [docs/Report/README.md](docs/Report/README.md).
Documentation and agent rules (`agent.md`, `AGENTS.md`) are intentionally ignored
by Git, along with build outputs, dependencies, environment files, and TypeScript
build info. `bun.lock` is committed for reproducible installation.
