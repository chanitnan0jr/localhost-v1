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
      { src: '/images/CSTUSPARK/AWARD.jpg', alt: 'CSTU Spark Camp team holding the Best Creative and Engaging Pitch Award' },
      { src: '/images/CSTUSPARK/CSTUSPARK2.jpg', alt: 'CSTU Spark Camp group photo' },
      { src: '/images/CSTUSPARK/CSTUSPARK1.jpg', alt: 'CSTU Spark Camp team photo' },
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
    id: 'sustainovation', title: 'Sustainovation / DAD', mood: 'Confident',
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
]
