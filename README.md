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
| `hooks/` | Local clock, boolean toggles, stack carousel state |
| `context/` | Shared image dialog state |
| `lib/` | Typed content, Redis client factory, visitor identity/tracking |
| `public/images/` | Static photos and certificates |
| `scripts/check.cjs` | Small API/visitor regression check using Node assertions |

`/` displays the portfolio; `/projects` displays case studies.
Unmatched routes (including `/dev/null`) display a simulated terminal. Commands do
not execute a shell or make arbitrary network requests.

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

The same scripts work with `npm run`. Inter is bundled locally with its OFL license,
so builds do not download it. Material Symbols and stack icons still load from CDNs.

Thai implementation notes are local in [docs/README.md](docs/README.md).
Historical reports are in [docs/Report/README.md](docs/Report/README.md).
Documentation and agent rules (`agent.md`, `AGENTS.md`) are intentionally ignored
by Git, along with build outputs, dependencies, environment files, and TypeScript
build info. `bun.lock` is committed for reproducible installation.
