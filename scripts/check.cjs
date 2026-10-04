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
  const orbitHTML = renderToStaticMarkup(createElement(orbit.default, { dealt: false, paused: false, reducedMotion: true }))
  assert.equal((orbitHTML.match(/data-orbit-card=/g) ?? []).length, 52)
  const initialPositions = [...orbitHTML.matchAll(/class="orbit-card" style="left:([^;]+);top:([^;]+)/g)].map((match) => `${match[1]}:${match[2]}`)
  assert.equal(new Set(initialPositions).size, 52, 'Cards must form a ring before client effects run')
  const destinations = {
    Home: '/#home', Projects: '/projects', Work: '/#work',
    About: '/#about-detailed', Terminal: '/#terminal', Contact: '/#contact',
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
  for (const project of [...projects.OPENSOURCE_PROJECTS, ...projects.PERSONAL_PROJECTS]) {
    assert.ok(projectOutput.includes(project.name))
    assert.ok(projectOutput.includes(project.description))
  }
  const card = load('components/projects/ProjectCard.tsx', {})
  const sections = load('components/projects/ProjectsContent.tsx', {
    '@/lib/projectsData': projects, '@/components/projects/ProjectCard': card,
  })
  const projectHTML = renderToStaticMarkup(createElement(sections.default))
  const allProjects = [...projects.OPENSOURCE_PROJECTS, ...projects.PERSONAL_PROJECTS]
  const selectedWork = load('components/home/SelectedWork.tsx', {
    '@/lib/projectsData': projects,
    'next/link': { default: ({ children, ...props }) => createElement('a', props, children) },
  })
  const featuredHTML = renderToStaticMarkup(createElement(selectedWork.default))
  assert.equal((featuredHTML.match(/<article\b/g) ?? []).length, 3)
  assert.ok(featuredHTML.includes('href="/projects"'))
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
  assert.equal((projectHTML.match(/aria-expanded="true"/g) ?? []).length, 2)
  for (const project of allProjects) {
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

  const photos = load('lib/photoGallery.ts', {})
  assert.equal(new Set(photos.GALLERY_PHOTOS.map((photo) => photo.id)).size, photos.GALLERY_PHOTOS.length)
  for (const photo of photos.GALLERY_PHOTOS) assert.ok(readFileSync(join(__dirname, '..', 'public', photo.src)).length)
  assert.equal(photos.PHOTO_POSITIONS.length, photos.GALLERY_PHOTOS.length)
  const originalOrder = photos.GALLERY_PHOTOS.map((photo) => photo.id)
  assert.deepEqual(photos.swapCenterPhoto(originalOrder, 'behind'), ['behind', 'cstu', 'icpc', 'pragma'])
  assert.deepEqual(photos.swapCenterPhoto(photos.swapCenterPhoto(originalOrder, 'behind'), 'icpc'), ['icpc', 'cstu', 'behind', 'pragma'])
  assert.deepEqual(photos.swapCenterPhoto(originalOrder, 'missing'), originalOrder)
  for (let attempt = 0; attempt < 20; attempt++) {
    const shuffled = photos.shufflePhotoOrder(originalOrder)
    assert.deepEqual([...shuffled].sort(), [...originalOrder].sort())
    assert.notDeepEqual(shuffled, originalOrder)
  }
  assert.deepEqual(originalOrder, photos.GALLERY_PHOTOS.map((photo) => photo.id))
  assert.deepEqual(photos.clampPhotoPosition({ x: -20, y: 180, rotation: -8 }, 20, 25), { x: 20, y: 75, rotation: -8 })
  assert.deepEqual(photos.clampPhotoPosition({ x: 80, y: 10, rotation: 0 }, 70, 80), { x: 50, y: 50, rotation: 0 })
  const gallery = load('components/detective/PhotoGallery.tsx', { '@/lib/photoGallery': photos, 'next/image': { default: () => null } })
  const galleryHTML = renderToStaticMarkup(createElement(gallery.default))
  assert.equal((galleryHTML.match(/data-photo=/g) ?? []).length, 4)
  assert.equal((galleryHTML.match(/aria-label="Read the story:/g) ?? []).length, 4)
  assert.equal((galleryHTML.match(/aria-label="Move /g) ?? []).length, 4)
  assert.ok(galleryHTML.includes('Reset positions'))
  assert.ok(galleryHTML.includes('Shuffle photo arrangement'))
  assert.ok(galleryHTML.includes('id="photo-note-title">CSTU Spark Camp'))
  assert.equal((galleryHTML.match(/aria-expanded="true"/g) ?? []).length, 1)

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
  console.log('Rendering, photo gallery/shuffle/bounds, 52-card deck, terminal commands/navigation, visitor tracking, live APIs, and failure fallbacks passed.')
}

check().catch((error) => { console.error(error); process.exitCode = 1 })
