export type PhotoPosition = { x: number; y: number; rotation: number }

export const GALLERY_PHOTOS = [
  {
    id: 'cstu', category: 'Competitions', title: 'CSTU Spark Camp',
    src: '/images/CSTUSPARK/AWARD.jpg', alt: 'CSTU Spark Camp team holding the Best Creative and Engaging Pitch Award',
    note: 'Built and presented an AI-assisted academic portal for TQF3 workflows with my team.',
    tags: 'Teamwork / AI / Presentation',
  },
  {
    id: 'behind', category: 'Behind the scenes', title: 'Behind the scenes.',
    src: '/images/Profilepic.jpg', alt: 'Chanitnan and teammates working together around a table with laptops',
    note: 'Working with teammates around a table, laptops open for a collaborative session.',
    tags: 'Collaboration / Building / Everyday',
  },
  {
    id: 'icpc', category: 'Competitions', title: 'ICPC 2026.',
    src: '/images/ICPC2026/Main.jpg', alt: 'ICPC Thailand Central Region contestants posing together at the competition',
    note: 'Solving algorithmic problems against the clock at the ICPC regional qualifier. Our team placed 18th out of 52 and advanced to the national round.',
    tags: 'Algorithms / Problem solving / Teamwork',
  },
  {
    id: 'pragma', category: 'Competitions', title: 'PRAGMA 41.',
    src: '/images/PRAGMA41/PRAGMA1.jpg', alt: 'PRAGMA 41 team beneath their ICU sepsis decision-support presentation',
    note: 'Built an AI-powered clinical decision-support system for ICU sepsis management. Collaborated under a 24-hour delivery deadline.',
    tags: 'AI / Healthcare / Collaboration',
  },
] as const

export const PHOTO_POSITIONS: PhotoPosition[] = [
  { x: 50, y: 51, rotation: 2 }, { x: 23, y: 23, rotation: -8 },
  { x: 23, y: 78, rotation: -6 }, { x: 77, y: 25, rotation: 7 },
]

export function swapCenterPhoto(order: string[], id: string): string[] {
  const index = order.indexOf(id)
  if (index < 1) return order
  const next = [...order]
  ;[next[0], next[index]] = [next[index], next[0]]
  return next
}

export function shufflePhotoOrder(order: string[]): string[] {
  const next = [...order]
  for (let index = next.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1))
    ;[next[index], next[other]] = [next[other], next[index]]
  }
  // A camera click should always produce a visibly different arrangement.
  if (next.length > 1 && next.every((id, index) => id === order[index])) next.push(next.shift()!)
  return next
}

export function clampPhotoPosition(position: PhotoPosition, marginX: number, marginY: number): PhotoPosition {
  const clamp = (value: number, margin: number) => Math.max(Math.min(margin, 50), Math.min(100 - Math.min(margin, 50), value))
  return { ...position, x: clamp(position.x, marginX), y: clamp(position.y, marginY) }
}
