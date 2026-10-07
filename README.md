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
| `components/detective/` | 52-card hero, navigation hand, full-screen terminal, photographic timeline/evidence |
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
| 10♠ Terminal | `/terminal` |
| A♥ Contact | `/#contact` |

The terminal page at `/terminal` is a DOM console filling the screen below the existing navbar, with only output and a prompt. It has no footer, decorative clock, or shortcut buttons. Type `help` to explore and `exit` to return home. Keyboard history, inline completion, selection/copy, and Control-L clear remain available. It supports `help`, `whoami`, `ls`, `deck`, `history`, `date`, `clear`,
`cat about|projects|contact`, and `open home|projects|work|about|terminal|contact`.
`cd` and `goto` are navigation aliases. Up/Down recalls history; Tab cycles
suggestions or completes a single match. Enter accepts an incomplete suggestion
and runs a complete command; Right Arrow at the input end also completes it.
Escape clears input and suggestions. Quick command buttons run their fixed
commands through the same parser. Project output uses `lib/projectsData.ts`.
The timeline and original portfolio sections follow the hero on the home page.

At `/#gallery`, **02 / Timeline** presents **The story so far** as a photographic section with chapter copy on the left, a large event photo, and chapter controls below. Five chapters follow this order: PRAGMA 41, CSTU Spark Camp, ICPC Sub Regional, ICPC National, and Sustainovation / DAD. PRAGMA uses the landscape hackathon photo of teammates working around a table. ICPC Sub Regional is selected initially.

Dots and previous/next arrows preview chapters; Arrow keys and Home/End work on the chapter dots. Touch users can swipe the photo to change chapters. **View evidence** opens the selected board and moves focus to its heading. Without opening Evidence, scrolling continues straight to About Me. **Back to timeline** or Escape closes the board and returns focus to the selected dot.

Evidence has a Field Notes sheet, one large photo, and two smaller photos. Photo arrows cycle through all supplied images, including the four National photos. Select a smaller photo to make it the main print; activate the main print to expand it in the existing image viewer.
Mobile stacks chapter copy and controls below the photo, and stacks evidence images and notes.
Hero and Timeline use viewport-sized sections with native proximity scroll snapping;
short screens and long evidence content can still scroll naturally. Reduced motion disables snapping.
Evidence photos keep their original framing; the timeline photo uses a cover crop to match the reference; reduced motion disables transitions and smooth
navigation. Chapter data and verified descriptions live in `lib/portfolioTimeline.ts`.
Chapter order and emotion labels follow the owner's storyboard; no dates are inferred.
Sustainovation photos were supplied by the owner; its description is intentionally
limited to the team photo until more event details are provided. About and Philosophy
remain separate sections below the timeline. The blank folder texture is generated; people and event photos are originals.

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

The `/projects` page features AgriscanPro, Mini-Redis, and PyThaiNLP as featured case
studies above the full project catalog. The three cut-paper cards use original SVG illustrations
and the same project data as the rest of the page, with direct repository/contribution links. Cards stack
on mobile; buttons support keyboard focus and reduced motion.

### About / Philosophy

The About section pairs a masked identity card with the original engineering
introduction, followed by a full-width ivory Philosophy sheet and the original
GitHub, LinkedIn, and Discord links. Content stays still and stacks on mobile;
buttons support keyboard focus and reduced motion.
