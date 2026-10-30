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
  },
  {
    id: 'K-spades',
    rank: 'K',
    suit: 'spades',
    label: 'Projects',
    href: '/projects',
  },
  {
    id: 'Q-diamonds',
    rank: 'Q',
    suit: 'diamonds',
    label: 'Work',
    href: '/#work',
  },
  {
    id: 'J-clubs',
    rank: 'J',
    suit: 'clubs',
    label: 'About',
    href: '/#about-detailed',
  },
  {
    id: '10-spades',
    rank: '10',
    suit: 'spades',
    label: 'Terminal',
    href: '/terminal',
  },
  {
    id: 'A-hearts',
    rank: 'A',
    suit: 'hearts',
    label: 'Contact',
    href: '/#contact',
  },
]
