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
| `components/detective/` | 52-card hero, navigation hand, home terminal, photo table |
| `hooks/` | Local clock, boolean toggles, stack carousel state |
| `context/` | Shared image dialog state |
| `lib/` | Typed content, Redis client factory, visitor identity/tracking |
| `public/images/` | Static photos and certificates |
| `scripts/check.cjs` | Small rendering, photo, card, terminal, and visitor checks using Node assertions |

`/` displays the portfolio; `/projects` displays case studies.
Unmatched routes (including `/dev/null`) display a simulated terminal. Commands do
not execute a shell or make arbitrary network requests.

## Phantom Thief theme

The home page opens directly on the 2.5D Phantom Thief hero with an original masked
character and 52 unique playing cards, with no opening scene or loading overlay.
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
The photo gallery and original portfolio sections follow the terminal.

At `/#gallery`, photographic prints keep the original photos uncropped. Hover lifts a
print; select one to enlarge it alongside its **Calling Card** while the other photos
remain visible as thumbnails. The center photo's calling card appears by default.
Close or Escape returns the desktop arrangement, including custom drag positions.
Previous/next and Left/Right on a photo cycle within the current filter.

On desktop, drag photos to rearrange the table before selecting one. A drag release
never opens a note. Focus a grip and use arrow keys (Shift moves farther) as a keyboard
alternative. Click the camera to shuffle; **Reset positions** restores the original
layout. On mobile, swipe the native carousel with the calling card below; vertical
page scrolling remains available. Reduced motion disables animated transitions.
Photo metadata lives in `lib/photoGallery.ts`. About and the full Philosophy quote
are a separate, stationary section below the gallery.

The palette is black, vivid red, and ivory with angular paper strips, halftone details,
and offset shadows. Roboto Condensed supplies bold headings and menus; Inter keeps
longer text readable. Assets are local and no dependencies were added.

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

The same scripts work with `npm run`. Inter, Roboto Condensed, Cormorant Garamond, and Material Symbols
are bundled locally with their licenses, so builds do not download fonts.
Stack icons still load from a CDN. No new dependencies are required for the theme.

Thai implementation notes are local in [docs/README.md](docs/README.md).
Historical reports are in [docs/Report/README.md](docs/Report/README.md).
Documentation and agent rules (`agent.md`, `AGENTS.md`) are intentionally ignored
by Git, along with build outputs, dependencies, environment files, and TypeScript
build info. `bun.lock` is committed for reproducible installation.

### Selected Work

The home page features AgriscanPro, Mini-Redis, and PyThaiNLP between the terminal
and gallery. The three cut-paper cards use original SVG illustrations and the same
project data as `/projects`, with direct repository/contribution links. Cards stack
on mobile; buttons support keyboard focus and reduced motion.

### About / Philosophy

The About section pairs a masked identity card with the original engineering
introduction, followed by a full-width ivory Philosophy sheet and the original
GitHub, LinkedIn, and Discord links. Content stays still and stacks on mobile;
buttons support keyboard focus and reduced motion.
