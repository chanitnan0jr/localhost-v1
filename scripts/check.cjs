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

async function checkVisitorProvider() {
  const originalFetch = globalThis.fetch

  function harness() {
    const state = []
    const effects = []
    let hook = 0
    const module = load('context/VisitorContext.tsx', {
      react: {
        createContext: () => ({ Provider() {} }),
        useEffect: (effect) => effects.push(effect),
        useState(initial) {
          const index = hook++
          state[index] = initial
          return [initial, (value) => { state[index] = value }]
        },
      },
    })
    module.VisitorProvider({ children: null })
    return { state, effect: effects[0] }
  }

  try {
    let calls = []
    let current = harness()
    globalThis.fetch = async (url, options) => {
      calls.push([url, options])
      return url === '/api/track'
        ? { ok: true }
        : { ok: true, json: async () => ({ total: 0 }) }
    }
    let cleanup = current.effect()
    await new Promise(setImmediate)
    assert.deepEqual(calls.map(([url]) => url), ['/api/track', '/api/visitors'])
    assert.equal(calls[0][1].method, 'POST')
    assert.equal(calls[1][1].cache, 'no-store')
    assert.equal(current.state[0], 0, 'A real zero count is retained')
    assert.equal(current.state[1], false)
    cleanup()

    calls = []
    current = harness()
    globalThis.fetch = async (url) => {
      calls.push(url)
      return url === '/api/track' ? { ok: true } : { ok: false, status: 503 }
    }
    cleanup = current.effect()
    await new Promise(setImmediate)
    assert.deepEqual(calls, ['/api/track', '/api/visitors'])
    assert.equal(current.state[0], null, 'Redis unavailable leaves no live count')
    assert.equal(current.state[1], false)
    cleanup()

    calls = []
    current = harness()
    globalThis.fetch = async (url) => {
      calls.push(url)
      throw new Error('offline')
    }
    cleanup = current.effect()
    await new Promise(setImmediate)
    assert.deepEqual(calls, ['/api/track', '/api/visitors'])
    assert.equal(current.state[0], null, 'Network failure leaves no live count')
    assert.equal(current.state[1], false)
    cleanup()

    calls = []
    current = harness()
    let finishTrack
    let signal
    globalThis.fetch = (url, options) => {
      calls.push(url)
      signal = options.signal
      return new Promise((resolve) => { finishTrack = resolve })
    }
    cleanup = current.effect()
    cleanup()
    assert.equal(signal.aborted, true)
    finishTrack({ ok: true })
    await new Promise(setImmediate)
    assert.deepEqual(calls, ['/api/track'], 'Aborting the mount prevents the follow-up request')
    assert.equal(current.state[1], true, 'An aborted provider does not update state after unmount')
  } finally {
    globalThis.fetch = originalFetch
  }
}

async function check() {
  const { createElement } = require('react')
  const { renderToStaticMarkup } = require('react-dom/server')
  const projects = load('lib/projectsData.ts', {})
  const deck = load('lib/cardDeck.ts', {})
  const terminal = load('lib/terminalCommands.ts', {
    './cardDeck': deck,
    './projectsData': projects,
    './contact': load('lib/contact.ts', {}),
  })
  assert.equal(deck.FULL_DECK.length, 52)
  assert.equal(new Set(deck.FULL_DECK.map((card) => card.id)).size, 52)
  const playingCard = load('components/phantom/PlayingCard.tsx', { '@/lib/cardDeck': deck })
  const orbit = load('components/phantom/CardOrbit.tsx', { '@/lib/cardDeck': deck, './PlayingCard': playingCard, 'next/image': { default: () => null } })
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
  assert.equal(deck.DESTINATIONS.length, 6)
  for (const card of deck.DESTINATIONS) assert.equal(card.href, destinations[card.label])
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
  const notFound = load('lib/notFoundTerminal.ts', {})
  const client = { os: 'Linux x86_64', browser: 'Firefox', cores: 8, ram: '8 GB', screen: '1920x1080', tz: 'Asia/Bangkok', connection: '4g' }
  assert.equal(notFound.detectOS('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'), 'macOS 10.15.7 arm64')
  assert.equal(notFound.detectBrowser('Mozilla/5.0 Chrome/120 Edg/120'), 'Microsoft Edge')
  const boot = notFound.buildBootSequence('203.0.113.7', client)
  assert.ok(boot.includes('systemd[1]: Source IP: 203.0.113.7'))
  assert.equal(boot.at(-2), '404: PAGE_NOT_FOUND — The address you requested does not exist.')
  assert.deepEqual(terminal.visitorStatsLines({ total: 3, byOs: { Linux: 1, macOS: 2 } }), ['Total Unique Visitors: 3', 'Breakdown by OS:', '  macOS            2 visitors', '  Linux            1 visitor'])
  assert.deepEqual(terminal.visitorStatsLines({ total: 0, byOs: {} }), ['Total Unique Visitors: 0'])
  for (const failed of [null, { error: 'Redis offline' }, { total: '3' }]) {
    assert.match(terminal.visitorStatsLines(failed)[0], /Local Demo/, 'Missing statistics fall back to the demo')
  }
  const card = load('components/projects/ProjectCard.tsx', {})
  const sections = load('components/projects/ProjectsContent.tsx', {
    '@/lib/projectsData': projects, '@/components/projects/ProjectCard': card,
  })
  const projectHTML = renderToStaticMarkup(createElement(sections.default))
  const allProjects = [...projects.OPENSOURCE_PROJECTS, ...projects.COLLABORATIVE_PROJECTS, ...projects.PERSONAL_PROJECTS]
  assert.equal((projectHTML.match(/<article\b/g) ?? []).length, allProjects.length)
  assert.equal((projectHTML.match(/aria-expanded="true"/g) ?? []).length, 3)
  assert.ok(projectHTML.includes('Collaborative Project'))
  assert.ok(projectHTML.includes('Open Source'))
  assert.ok(projectHTML.includes('Personal Projects'))
  assert.equal(projects.COLLABORATIVE_PROJECTS.length, 2)
  for (const project of allProjects) {
    if (project.contribution) assert.ok(projectHTML.includes(project.contribution))
    assert.ok(projectHTML.includes(project.name))
    for (const tag of project.tags) assert.ok(projectHTML.includes(tag))
    if (project.repoUrl) assert.ok(projectHTML.includes(`href="${project.repoUrl}"`))
    if (project.liveUrl) assert.ok(projectHTML.includes(`href="${project.liveUrl}"`))
  }

  const contact = load('lib/contact.ts', {})
  const getInTouch = load('components/home/GetInTouch.tsx', { '@/lib/contact': contact })
  const footer = load('components/layout/Footer.tsx', { '@/lib/contact': contact })
  const contactHTML = renderToStaticMarkup(createElement(getInTouch.default))
  const footerHTML = renderToStaticMarkup(createElement(footer.default))
  for (const html of [contactHTML, footerHTML]) {
    assert.ok(html.includes(`href="mailto:${contact.CONTACT.email}"`))
    assert.ok(html.includes(`href="tel:${contact.CONTACT.phone.replaceAll('-', '')}"`))
    for (const network of ['github', 'linkedin', 'discord']) {
      assert.ok(html.includes(`href="${contact.CONTACT[network]}"`))
    }
  }
  assert.ok(contactHTML.includes(contact.CONTACT.phone))

  const hookState = []
  let hookCursor = 0
  let now = 0
  const originalPerformance = globalThis.performance
  const stackData = load('lib/stackData.ts', {})
  globalThis.performance = { now: () => now }
  try {
    const carousel = load('hooks/useStackCarousel.ts', {
      react: {
        useRef(initial) {
          const slot = hookCursor++
          return (hookState[slot] ??= { current: initial })
        },
        useState(initial) {
          const slot = hookCursor++
          hookState[slot] ??= { value: initial }
          return [hookState[slot].value, (update) => {
            hookState[slot].value = typeof update === 'function' ? update(hookState[slot].value) : update
          }]
        },
      },
      '@/lib/stackData': stackData,
    })
    const renderCarousel = () => {
      hookCursor = 0
      return carousel.useStackCarousel()
    }
    let controls = renderCarousel()
    controls.setMode('carousel')
    controls = renderCarousel()
    controls.prev()
    assert.equal(hookState[0].value, stackData.STACK_CATEGORIES.length - 1, 'Previous wraps to the last stack category')
    now = 150
    controls.next()
    assert.equal(hookState[0].value, stackData.STACK_CATEGORIES.length - 1, 'Carousel ignores moves during its 300 ms throttle')
    now = 300
    controls.next()
    assert.equal(hookState[0].value, 0, 'Carousel accepts the next move at 300 ms')
  } finally {
    globalThis.performance = originalPerformance
  }

  const timeline = load('lib/portfolioTimeline.ts', {})
  assert.equal(new Set(timeline.TIMELINE_CHAPTERS.map((chapter) => chapter.id)).size, 6)
  assert.deepEqual(timeline.TIMELINE_CHAPTERS.map((chapter) => chapter.id), ['pragma', 'cstu', 'icpc', 'icpc-national', 'sustainovation', 'u-hackathon'])
  for (const chapter of timeline.TIMELINE_CHAPTERS) {
    assert.equal(chapter.photos.length, { 'icpc-national': 4, 'u-hackathon': 7 }[chapter.id] ?? 3, 'Each chapter keeps its supplied evidence images')
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
  const story = load('components/phantom/PortfolioTimeline.tsx', {
    '@/lib/portfolioTimeline': timeline,
    '@/context/ModalContext': { useModalContext: () => ({ openGallery() {} }) },
    'next/image': { default: () => null },
  })
  const storyHTML = renderToStaticMarkup(createElement(story.default))
  assert.ok(storyHTML.includes(`aria-label="Open ${timeline.TIMELINE_CHAPTERS[0].title} gallery, ${timeline.TIMELINE_CHAPTERS[0].photos.length} photos"`), 'The Timeline photo opens its chapter gallery')

  let modal = null
  const modalContext = load('context/ModalContext.tsx', {
    react: {
      createContext: () => ({ Provider: 'modal-provider' }),
      useContext() {},
      useCallback: (callback) => callback,
      useState: () => [null, (next) => { modal = typeof next === 'function' ? next(modal) : next }],
    },
    'framer-motion': { MotionConfig: 'motion-config' },
  })
  const gallery = modalContext.ModalProvider({ children: null }).props.children.props.value
  const hackathon = timeline.TIMELINE_CHAPTERS.find((chapter) => chapter.id === 'u-hackathon')
  gallery.openGallery(hackathon.title, hackathon.photos)
  gallery.showPhoto(-1)
  assert.equal(modal.index, 6, 'Previous on the first photo wraps to the last')
  gallery.showPhoto(7)
  assert.equal(modal.index, 0, 'Next on the last photo wraps to the first')
  gallery.openModal('/images/Botnoi/BOTNOI-CERT.png')
  assert.deepEqual(modal, { photos: [{ src: '/images/Botnoi/BOTNOI-CERT.png', alt: 'Expanded image' }], index: 0 })

  const renderModal = (state) => renderToStaticMarkup(createElement(load('components/ui/ImageModal.tsx', {
    '@/context/ModalContext': { useModalContext: () => ({ modal: state, showPhoto() {}, closeModal() {} }) },
  }).default))
  const galleryHTML = renderModal({ title: hackathon.title, photos: hackathon.photos, index: 2 })
  assert.ok(galleryHTML.includes('aria-label="U-Hackathon gallery"'))
  assert.ok(galleryHTML.includes('03 / 07') && galleryHTML.includes(`alt="${hackathon.photos[2].alt}"`))
  assert.ok(galleryHTML.includes('aria-label="Previous photo"') && galleryHTML.includes('aria-label="Next photo"'))
  assert.ok(!renderModal(modal).includes('Previous photo'), 'A single certificate keeps the plain image preview')
  assert.equal((storyHTML.match(/aria-label="Go to chapter /g) ?? []).length, 6)
  assert.ok(storyHTML.includes('data-chapter="pragma"'))
  assert.equal(timeline.TIMELINE_CHAPTERS[0].timelinePhoto.src, '/images/PRAGMA41/PRAGMA2.jpg', 'PRAGMA Timeline must show the landscape hackathon photo')
  assert.equal(timeline.TIMELINE_CHAPTERS[5].photos[0].src, '/images/U-Hackathon/20261015_094657.jpg', 'U-Hackathon Timeline must show the welcome screen photo')
  assert.ok(storyHTML.includes('id="gallery"'), 'Existing gallery hashes must keep their target')
  assert.ok(!storyHTML.includes('timeline-evidence'), 'Timeline must not render the removed evidence panel')

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

  redis = { async scard() { return 0 }, async hgetall() { return null } }
  assert.deepEqual(await (await stats.GET()).json(), { total: 0, byOs: {} }, 'A valid zero count remains available data')

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
  assert.deepEqual(await info.json(), { ip: visitor.ip }, 'sysinfo only returns the IP used by the 404 boot sequence')
  await checkVisitorProvider()
  console.log('Rendering, project/contact data, carousel throttle, Timeline/gallery dialog, 52-card deck, shared terminal commands, 404 boot sequence, visitor state/APIs, and failure fallbacks passed.')
}

check().catch((error) => { console.error(error); process.exitCode = 1 })
