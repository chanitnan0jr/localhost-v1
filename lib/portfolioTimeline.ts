export type TimelineChapter = {
  id: string
  title: string
  mood: 'Uncomfortable' | 'Happy' | 'Serious' | 'Confident'
  badgeText: string
  summary: string
  caption: string
  notes: [string, string]
  timelinePhoto?: { src: string; alt: string }
  photos: { src: string; alt: string }[]
}

// Chapter order and moods follow the owner's storyboard; dates are not inferred.
export const TIMELINE_CHAPTERS: TimelineChapter[] = [
  {
    id: 'pragma', title: 'PRAGMA 41', mood: 'Uncomfortable',
    badgeText: 'STARTING BEFORE FEELING READY.',
    timelinePhoto: { src: '/images/PRAGMA41/PRAGMA2.jpg', alt: 'PRAGMA 41 teammates working together on laptops around a table during the hackathon' },
    caption: 'Working across disciplines.',
    summary: 'Built an AI-powered clinical decision-support system for ICU sepsis management. Collaborated under a 24-hour delivery deadline.',
    notes: ['Working across disciplines.', 'An idea. A deadline. A team.'],
    photos: [
      { src: '/images/PRAGMA41/PRAGMA1.jpg', alt: 'PRAGMA 41 team beneath their ICU sepsis decision-support presentation' },
      { src: '/images/PRAGMA41/PRAGMA2.jpg', alt: 'PRAGMA 41 teammates working together on laptops around a table during the hackathon' },
      { src: '/images/PRAGMA41/Award.png', alt: 'PRAGMA 41 Excellent in Team Work Award certificate' },
    ],
  },
  {
    id: 'cstu', title: 'CSTU Spark Camp', mood: 'Happy',
    badgeText: 'TEAMWORK IS THE ESSENCE OF SUCCESS.',
    caption: 'Built and presented together.',
    summary: 'Built and presented an AI-assisted academic portal for TQF3 workflows with my team.',
    notes: ['With my team.', 'One event. Many memories.'],
    photos: [
      { src: '/images/CSTUSPARKCAMPINAI/AWARD.jpg', alt: 'CSTU Spark Camp team holding the Best Creative and Engaging Pitch Award' },
      { src: '/images/CSTUSPARKCAMPINAI/CSTUSPARK2.jpg', alt: 'CSTU Spark Camp group photo' },
      { src: '/images/CSTUSPARKCAMPINAI/CSTUSPARK1.jpg', alt: 'CSTU Spark Camp team photo' },
    ],
  },
  {
    id: 'icpc', title: 'ICPC Sub Regional', mood: 'Serious',
    badgeText: 'TIME TO TEST MY FOUNDATION.',
    caption: 'Higher stakes. Sharper focus.',
    summary: 'Solving algorithmic problems against the clock at the ICPC regional qualifier. Our team placed 18th out of 52 and advanced to the national round.',
    notes: ['Thinking against the clock.', 'Problem solving. Together.'],
    photos: [
      { src: '/images/ICPC2026/Main.jpg', alt: 'ICPC Thailand Central Region contestants posing together at the competition' },
      { src: '/images/ICPC2026/ICPC1.jpg', alt: 'ICPC Thailand qualifier team photo' },
      { src: '/images/ICPC2026/ICPC3.jpg', alt: 'ICPC Thailand qualifier team photo' },
    ],
  },
  {
    id: 'icpc-national', title: 'ICPC National', mood: 'Serious',
    badgeText: 'NOW, I COMPETE AGAINST THE BEST.',
    caption: 'ICPC Thailand. National contest.',
    summary: 'Competing in the ICPC Thailand National Contest with my team.',
    notes: ['At the national contest.', 'A few moments away from the contest.'],
    photos: [
      { src: '/images/ICPC2026/National/contest-team.webp', alt: 'Three ICPC National teammates standing behind the CSKU letters at Kasetsart University' },
      { src: '/images/ICPC2026/National/contest-portrait.webp', alt: 'ICPC Thailand National Contest participants posing in front of the event backdrop' },
      { src: '/images/ICPC2026/National/pond-seated.webp', alt: 'A person sitting on a wooden platform beside a koi pond' },
      { src: '/images/ICPC2026/National/pond-standing.webp', alt: 'A person standing on a wooden deck beside a koi pond at night' },
    ],
  },
  {
    // The soft hyphen lets the narrow six-chapter mobile label wrap without overlapping.
    id: 'sustainovation', title: 'Sustain\u00ADovation / DAD', mood: 'Confident',
    badgeText: 'NEW PEOPLE. NEW PROBLEMS. CAN I ADAPT?',
    caption: 'A few moments worth keeping.',
    summary: 'Team moments at Sustainovation.',
    notes: ['With my team.', 'A few moments worth keeping.'],
    photos: [
      { src: '/images/Sustainovation/team-1.webp', alt: 'Four Sustainovation teammates posing together, one holding a box' },
      { src: '/images/Sustainovation/team-2.webp', alt: 'Sustainovation team posing together, one teammate making a peace sign' },
      { src: '/images/Sustainovation/team-3.webp', alt: 'Sustainovation teammates standing together for another group photo' },
    ],
  },
  {
    id: 'u-hackathon', title: 'U-Hackathon', mood: 'Confident',
    badgeText: 'A BIGGER STAGE. A NEW ECOSYSTEM.',
    caption: 'Eight steps. Start to submit.',
    summary: 'Joined u-hackathon at FLOW Summit 2026, from the opening briefing to the u-topia public beta launch.',
    notes: ['Eight steps, start to submit.', 'u-topia is open.'],
    // 20261015_094636.jpg is left out: it shows mentor-consultation login details.
    photos: [
      { src: '/images/U-Hackathon/20261015_094657.jpg', alt: 'u-hackathon welcome screen with sponsor logos above participants arriving in the event hall' },
      { src: '/images/U-Hackathon/20261016_113556.jpg', alt: 'Speaker on stage presenting the eight-step u-hackathon submission flow' },
      { src: '/images/U-Hackathon/20261016_114155.jpg', alt: 'Speaker on stage presenting the u-hackathon pitch deck guide' },
      { src: '/images/U-Hackathon/20261016_153006.jpg', alt: 'FLOW Summit 2026 panel discussion on crypto adoption in 2026' },
      { src: '/images/U-Hackathon/20261016_170324.jpg', alt: 'Crowd watching the screen announce that u-topia was a private beta until today' },
      { src: '/images/U-Hackathon/20261016_170405.jpg', alt: 'Crowd raising phones during the countdown to the u-topia launch' },
      { src: '/images/U-Hackathon/20261016_170411.jpg', alt: 'Launch screen reading u-topia is open with a beta QR code above the crowd' },
    ],
  },
]
