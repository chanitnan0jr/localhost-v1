export const SUITS = ['spades', 'hearts', 'clubs', 'diamonds'] as const
export type Suit = (typeof SUITS)[number]
export const SUIT_SYMBOLS: Record<Suit, string> = {
  spades: '♠',
  hearts: '♥',
  clubs: '♣',
  diamonds: '♦',
}
export const RANKS = [
  'A',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
] as const
export type Rank = (typeof RANKS)[number]
export interface Card {
  id: string
  rank: Rank
  suit: Suit
}
export interface Destination extends Card {
  label: string
  href: string
  description: string
}
export const FULL_DECK: Card[] = SUITS.flatMap((suit) =>
  RANKS.map((rank) => ({ id: `${rank}-${suit}`, rank, suit })),
)
export const DESTINATIONS: Destination[] = [
  {
    id: 'A-spades',
    rank: 'A',
    suit: 'spades',
    label: 'Home',
    href: '/#home',
    description: 'Back to the beginning',
  },
  {
    id: 'K-spades',
    rank: 'K',
    suit: 'spades',
    label: 'Projects',
    href: '/projects',
    description: 'See what I have built',
  },
  {
    id: 'Q-diamonds',
    rank: 'Q',
    suit: 'diamonds',
    label: 'Work',
    href: '/#work',
    description: 'Research & experience',
  },
  {
    id: 'J-clubs',
    rank: 'J',
    suit: 'clubs',
    label: 'About',
    href: '/#about-detailed',
    description: 'Meet the curious mind',
  },
  {
    id: '10-spades',
    rank: '10',
    suit: 'spades',
    label: 'Terminal',
    href: '/#terminal',
    description: 'Take the command line',
  },
  {
    id: 'A-hearts',
    rank: 'A',
    suit: 'hearts',
    label: 'Contact',
    href: '/#contact',
    description: 'Leave a message',
  },
]
/** Shuffle on interaction to keep server and initial client markup identical. */
export function shuffleHand(): Destination[] {
  const hand = [...DESTINATIONS]
  for (let index = hand.length - 1; index > 0; index--) {
    const next = Math.floor(Math.random() * (index + 1))
    ;[hand[index], hand[next]] = [hand[next], hand[index]]
  }
  return hand
}
