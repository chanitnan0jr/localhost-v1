const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const { join } = require('node:path')
const { runInThisContext } = require('node:vm')
const ts = require('typescript')

// ponytail: use the installed TypeScript compiler and Node assertions, no test framework.
function load(file, imports) {
  const { outputText } = ts.transpileModule(readFileSync(join(__dirname, '..', file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  })
  const exports = {}
  runInThisContext(`(function(exports, require, console) { ${outputText}\n})`, { filename: file })(
    exports,
    (id) => imports[id] ?? require(id),
    { error() {} },
  )
  return exports
}

async function check() {
  const { createElement } = require('react')
  const { renderToStaticMarkup } = require('react-dom/server')
  const projects = load('lib/projectsData.ts', {})
  const deck = load('lib/cardDeck.ts', {})
  const terminal = load('lib/terminalCommands.ts', { './cardDeck': deck, './projectsData': projects })
  assert.equal(deck.FULL_DECK.length, 52)
  assert.equal(new Set(deck.FULL_DECK.map((card) => card.id)).size, 52)
  const playingCard = load('components/detective/PlayingCard.tsx', { '@/lib/cardDeck': deck })
  const orbit = load('components/detective/CardOrbit.tsx', { '@/lib/cardDeck': deck, './PlayingCard': playingCard, 'next/image': { default: () => null } })
  const orbitHTML = renderToStaticMarkup(createElement(orbit.default, { reducedMotion: true }))
  assert.equal((orbitHTML.match(/data-orbit-card=/g) ?? []).length, 52)
  const initialPositions = [...orbitHTML.matchAll(/class="orbit-card" style="left:([^;]+);top:([^;]+)/g)].map((match) => `${match[1]}:${match[2]}`)
  assert.equal(new Set(initialPositions).size, 52, 'Cards must form a ring before client effects run')
  const cardLayers = [...orbitHTML.matchAll(/class="orbit-card" style="[^"]*z-index:(\d+)/g)].map((match) => Number(match[1]))
  assert.equal(cardLayers.length, 52)
  assert.equal(new Set(cardLayers).size, 52, 'Each orbit card must have a unique layer')
  cardLayers.forEach((layer, index) => {
    const y = Number(initialPositions[index].split(':')[1].replace('%', ''))
    assert.ok(y <= 52 ? layer < 50 : layer > 50, 'Return arc cards must sit behind the figure; front arc cards in front')
  })
  for (const front of [false, true]) {
    const smallLayers = cardLayers.filter((layer, index) => index % 3 !== 0 && (layer > 50) === front)
    const largeLayers = cardLayers.filter((layer, index) => index % 3 === 0 && (layer > 50) === front)
    assert.ok(Math.max(...smallLayers) < Math.min(...largeLayers), 'Within each side of the figure, small cards must sit below large cards')
  }
  assert.ok(Math.max(...cardLayers) < 100, 'Cards must stay below the ground overlay')
  const cardOpacities = [...orbitHTML.matchAll(/class="orbit-card" style="[^"]*opacity:([^;]+)/g)].map((match) => Number(match[1]))
  assert.equal(cardOpacities.length, 52)
  assert.ok(cardOpacities.every((opacity) => opacity === 1), 'Cards must be opaque at rest so lower layers cannot show through')
  const destinations = {
    Home: '/#home', Projects: '/projects', Work: '/#work',
    About: '/#about-detailed', Terminal: '/terminal', Contact: '/#contact',
  }
  const originalHand = deck.DESTINATIONS.map((card) => card.id)
  for (let index = 0; index < 10; index++) {
    const hand = deck.shuffleHand()
    assert.deepEqual(hand.map((card) => card.id).sort(), [...originalHand].sort())
    for (const card of hand) assert.equal(card.href, destinations[card.label])
  }
  assert.deepEqual(deck.DESTINATIONS.map((card) => card.id), originalHand)
  for (const [label, href] of Object.entries(destinations)) {
    for (const verb of ['open', 'cd', 'goto']) {
      assert.equal(terminal.runTerminalCommand(`  ${verb.toUpperCase()}   /${label}  `, []).navigate, href)
    }
  }
  for (const command of ['constructor', 'open __proto__', 'goto javascript:alert(1)', 'open https://example.com']) {
    const result = terminal.runTerminalCommand(command, [])
    assert.equal(result.kind, 'error')
    assert.equal(result.navigate, undefined)
  }
  assert.ok(terminal.TERMINAL_COMMANDS.includes('open terminal'))
  assert.equal(terminal.runTerminalCommand('clear', []).clear, true)
  assert.deepEqual(terminal.runTerminalCommand('history', ['ls', 'whoami']).lines, ['  1  ls', '  2  whoami'])
  const projectOutput = terminal.runTerminalCommand('cat projects', []).lines.join('\n')
  for (const project of [...projects.OPENSOURCE_PROJECTS, ...projects.COLLABORATIVE_PROJECTS, ...projects.PERSONAL_PROJECTS]) {
    assert.ok(projectOutput.includes(project.name))
    assert.ok(projectOutput.includes(project.description))
  }
  const card = load('components/projects/ProjectCard.tsx', {})
  const sections = load('components/projects/ProjectsContent.tsx', {
    '@/lib/projectsData': projects, '@/components/projects/ProjectCard': card,
  })
  const projectHTML = renderToStaticMarkup(createElement(sections.default))
  const allProjects = [...projects.OPENSOURCE_PROJECTS, ...projects.COLLABORATIVE_PROJECTS, ...projects.PERSONAL_PROJECTS]
  const selectedWork = load('components/home/SelectedWork.tsx', {
    '@/lib/projectsData': projects,
    'next/link': { default: ({ children, ...props }) => createElement('a', props, children) },
  })
  const featuredHTML = renderToStaticMarkup(createElement(selectedWork.default))
  assert.equal((featuredHTML.match(/<article\b/g) ?? []).length, 3)
  for (const id of ['agriscanpro', 'mini-redis', 'pythainlp']) {
    const project = allProjects.find((entry) => entry.id === id)
    assert.ok(project, `Featured project ${id} must exist in the shared data`)
    assert.ok(featuredHTML.includes(project.name))
    assert.ok(featuredHTML.includes(project.description))
    assert.ok(featuredHTML.includes(`href="${project.repoUrl}"`))
    assert.ok(featuredHTML.includes(`id="work-dots-${id}"`), 'Illustration pattern IDs must be unique')
  }
  assert.ok(featuredHTML.includes('Merged · PR #1400'))
  assert.equal((projectHTML.match(/<article\b/g) ?? []).length, allProjects.length)
  assert.equal((projectHTML.match(/aria-expanded="true"/g) ?? []).length, 3)
  assert.ok(projectHTML.includes('Collaborative Project'))
  assert.equal(projects.COLLABORATIVE_PROJECTS.length, 3)
  for (const project of allProjects) {
    if (project.contribution) assert.ok(projectHTML.includes(project.contribution))
    assert.ok(projectHTML.includes(project.name))
    if (project.repoUrl) assert.ok(projectHTML.includes(`href="${project.repoUrl}"`))
    if (project.liveUrl) assert.ok(projectHTML.includes(`href="${project.liveUrl}"`))
  }
  const competitions = load('components/home/Competitions.tsx', {
    '@/hooks/useToggle': load('hooks/useToggle.ts', {}),
    '@/context/ModalContext': { useModalContext: () => ({ openModal() {} }) },
  })
  const competitionHTML = renderToStaticMarkup(createElement(competitions.default))
  assert.equal((competitionHTML.match(/<h3\b/g) ?? []).length, 4)
  for (const id of ['cstu-spark-camp-photo', 'icpc-qualifier-photo', 'pragma-photo']) {
    assert.ok(competitionHTML.includes(`aria-controls="${id}"`))
  }
  assert.ok(competitionHTML.includes('Super AI Engineer Season 6'))
  assert.ok(competitionHTML.includes('View Submitted Code'))

  const timeline = load('lib/portfolioTimeline.ts', {})
  assert.equal(new Set(timeline.TIMELINE_CHAPTERS.map((chapter) => chapter.id)).size, 5)
  assert.deepEqual(timeline.TIMELINE_CHAPTERS.map((chapter) => chapter.id), ['pragma', 'cstu', 'icpc', 'icpc-national', 'sustainovation'])
  for (const chapter of timeline.TIMELINE_CHAPTERS) {
    assert.equal(chapter.photos.length, chapter.id === 'icpc-national' ? 4 : 3, 'Each chapter keeps its supplied evidence images')
    if (chapter.timelinePhoto) {
      assert.ok(chapter.timelinePhoto.alt)
      assert.ok(readFileSync(join(__dirname, '..', 'public', chapter.timelinePhoto.src)).length)
    }
    for (const photo of chapter.photos) {
      assert.ok(photo.alt, 'Evidence needs meaningful alternative text')
      assert.ok(readFileSync(join(__dirname, '..', 'public', photo.src)).length)
    }
  }
  assert.ok(readFileSync(join(__dirname, '..', 'public/images/timeline/evidence-board.webp')).length)
  assert.ok(readFileSync(join(__dirname, '..', 'public/images/timeline/chapter-folder.webp')).length)
  const story = load('components/detective/PortfolioTimeline.tsx', { '@/lib/portfolioTimeline': timeline, 'next/image': { default: () => null }, '@/context/ModalContext': { useModalContext: () => ({ openModal() {} }) } })
  const storyHTML = renderToStaticMarkup(createElement(story.default))
  assert.equal((storyHTML.match(/aria-label="Go to chapter /g) ?? []).length, 5)
  assert.ok(storyHTML.includes('data-chapter="icpc"'))
  assert.equal(timeline.TIMELINE_CHAPTERS[0].timelinePhoto.src, '/images/PRAGMA41/PRAGMA2.jpg', 'PRAGMA Timeline must show the landscape hackathon photo')
  assert.ok(storyHTML.includes('id="gallery"'), 'Existing gallery hashes must keep their target')
  assert.ok(storyHTML.includes('id="timeline-evidence"'), 'Chapter controls need an evidence target')
  assert.ok(storyHTML.includes('data-evidence="icpc"'), 'ICPC is the initial chapter')
  assert.match(storyHTML, /<section[^>]*id="timeline-evidence"[^>]*hidden=""/, 'Evidence must be hidden initially so scrolling continues to About')
  assert.ok(storyHTML.includes('Field notes'))
  assert.ok(storyHTML.includes('Expand photo 01:'))
  assert.equal((storyHTML.match(/class="evidence-print evidence-print-/g) ?? []).length, 3)
  assert.ok(storyHTML.includes('Back to timeline'))
  assert.ok(storyHTML.includes('Higher stakes. Sharper focus.'))

  let redis = null
  const redisModule = { getRedis: () => redis }
  const visitors = load('lib/visitors.ts', { './redis': redisModule })
  const headers = (ua, ip = '203.0.113.10') => new Headers({ 'user-agent': ua, 'x-forwarded-for': ip })
  for (const [ua, os] of [
    ['Windows NT 10.0', 'Windows 10/11'], ['Windows NT 6.3', 'Windows 8.1'],
    ['Windows NT 6.1', 'Windows 7'], ['Linux; Android 14', 'Android 14'],
    ['iPhone; CPU iPhone OS 17 like Mac OS X', 'iOS'], ['Mac OS X 14_0', 'macOS'],
    ['Linux x86_64', 'Linux'], ['', 'Unknown'],
  ]) {
    assert.deepEqual(visitors.getVisitor(headers(ua)), { ip: '203.0.113.10', os })
  }
  assert.equal(visitors.getVisitor(headers('', ' 203.0.113.10 , 192.0.2.1')).ip, '203.0.113.10')
  assert.equal(visitors.getVisitor(headers('', '2001:db8::1')).ip, '2001:db8::1')
  assert.equal(visitors.getVisitor(headers('', 'not-an-ip')).ip, '127.0.0.1')
  assert.equal(visitors.getVisitor(new Headers({ 'x-real-ip': '192.0.2.8' })).ip, '192.0.2.8')
  assert.equal(visitors.getVisitor(new Headers()).ip, '127.0.0.1')

  const visitor = visitors.getVisitor(headers('Linux'))
  await visitors.trackVisitor(visitor) // Missing Redis is safe for local development.
  const unique = new Set()
  const counts = new Map()
  redis = {
    async sadd(key, value) {
      const isNew = !unique.has(value)
      unique.add(value)
      return Number(isNew)
    },
    async hincrby(key, field, amount) {
      await new Promise(setImmediate)
      const id = `${key}:${field}`
      counts.set(id, (counts.get(id) ?? 0) + amount)
    },
    async scard() { return unique.size },
    async hgetall() { return { Linux: counts.get('visitors:by_os:Linux') ?? 0 } },
  }
  await Promise.all(Array.from({ length: 20 }, () => visitors.trackVisitor(visitor)))
  assert.equal(unique.size, 1)
  assert.equal(counts.get('visitors:by_os:Linux'), 1)
  assert.equal(counts.get('visitors:by_ip:203.0.113.10'), 1)
  await visitors.trackVisitor({ ip: '127.0.0.1', os: 'Linux' })
  await visitors.trackVisitor({ ip: '::1', os: 'Linux' })
  assert.equal(unique.size, 1)

  const track = load('app/api/track/route.ts', { '@/lib/visitors': visitors })
  const stats = load('app/api/visitors/route.ts', { '@/lib/redis': redisModule })
  const sysinfo = load('app/api/sysinfo/route.ts', { '@/lib/visitors': visitors })
  const request = new Request('http://localhost/api/track', { headers: headers('Linux') })
  assert.deepEqual(await (await track.POST(request)).json(), { ok: true })
  assert.equal(stats.dynamic, 'force-dynamic')
  const response = await stats.GET()
  assert.equal(response.headers.get('cache-control'), 'no-store')
  assert.deepEqual(await response.json(), { total: 1, byOs: { Linux: 1 } })
  await visitors.trackVisitor({ ip: '192.0.2.8', os: 'Linux' })
  assert.equal((await (await stats.GET()).json()).total, 2)

  redis = null
  assert.equal((await stats.GET()).status, 503)
  assert.equal((await track.POST(request)).status, 200)
  redis = {
    async sadd() { throw new Error('offline') },
    async scard() { throw new Error('offline') },
    async hgetall() { throw new Error('offline') },
  }
  await assert.rejects(visitors.trackVisitor(visitor), /offline/)
  assert.equal((await track.POST(request)).status, 503)
  assert.equal((await stats.GET()).status, 503)
  const info = await sysinfo.GET(request)
  assert.equal(info.status, 200)
  assert.equal(info.headers.get('cache-control'), 'no-store')
  assert.equal((await info.json()).ip, visitor.ip)
  const missingReadme = load('app/api/sysinfo/route.ts', {
    '@/lib/visitors': visitors,
    'node:fs/promises': { async readFile() { throw new Error('missing README') } },
  })
  assert.equal((await (await missingReadme.GET(request)).json()).readme, '')
  console.log('Rendering, timeline/evidence/assets, 52-card deck, terminal commands/navigation, visitor tracking, live APIs, and failure fallbacks passed.')
}

check().catch((error) => { console.error(error); process.exitCode = 1 })
