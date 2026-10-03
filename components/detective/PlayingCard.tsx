import { Card, SUIT_SYMBOLS } from '@/lib/cardDeck'

const PIPS: Record<string, [number, number][]> = {
  '2': [
    [50, 40],
    [50, 104],
  ],
  '3': [
    [50, 40],
    [50, 72],
    [50, 104],
  ],
  '4': [
    [33, 40],
    [67, 40],
    [33, 104],
    [67, 104],
  ],
  '5': [
    [33, 40],
    [67, 40],
    [50, 72],
    [33, 104],
    [67, 104],
  ],
  '6': [
    [33, 38],
    [67, 38],
    [33, 72],
    [67, 72],
    [33, 106],
    [67, 106],
  ],
  '7': [
    [33, 38],
    [67, 38],
    [50, 55],
    [33, 72],
    [67, 72],
    [33, 106],
    [67, 106],
  ],
  '8': [
    [33, 38],
    [67, 38],
    [50, 55],
    [33, 72],
    [67, 72],
    [50, 89],
    [33, 106],
    [67, 106],
  ],
  '9': [
    [33, 33],
    [67, 33],
    [33, 59],
    [67, 59],
    [50, 72],
    [33, 85],
    [67, 85],
    [33, 111],
    [67, 111],
  ],
  '10': [
    [33, 33],
    [67, 33],
    [50, 47],
    [33, 59],
    [67, 59],
    [33, 85],
    [67, 85],
    [50, 97],
    [33, 111],
    [67, 111],
  ],
}

export default function PlayingCard({
  card,
  back = false,
}: {
  card: Card
  back?: boolean
}) {
  const symbol = SUIT_SYMBOLS[card.suit]
  const court = ['J', 'Q', 'K'].includes(card.rank)
  return (
    <svg
      viewBox="0 0 100 144"
      className="playing-card"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="1"
        y="1"
        width="98"
        height="142"
        rx="5"
        fill="#eee9db"
        stroke="#bca88c"
        strokeWidth="1.4"
      />
      {back ? (
        <g fill="none" stroke="#c9aa8e">
          <rect x="6" y="6" width="88" height="132" rx="2" fill="#652922" />
          <rect x="11" y="11" width="78" height="122" strokeWidth=".7" />
          {[0, 1, 2, 3, 4, 5, 6].map((row) =>
            [0, 1, 2, 3, 4].map((col) => (
              <path
                key={`${row}-${col}`}
                d={`M${18 + col * 16},${20 + row * 17} l7,8 -7,8 -7,-8 Z`}
                opacity=".45"
                strokeWidth=".65"
              />
            )),
          )}
          <path
            d="M50 41 70 72 50 103 30 72Z"
            fill="#652922"
            strokeWidth="1.4"
          />
          <text
            x="50"
            y="83"
            fill="#d9c8a6"
            stroke="none"
            textAnchor="middle"
            fontSize="32"
            fontFamily="Georgia,serif"
          >
            ♠
          </text>
        </g>
      ) : (
        <g
          fill={
            card.suit === 'hearts' || card.suit === 'diamonds'
              ? '#a3312c'
              : '#191513'
          }
          fontFamily="Georgia,serif"
          textAnchor="middle"
        >
          <text x="15" y="23" fontSize={card.rank === '10' ? 17 : 21}>
            {card.rank}
          </text>
          <text x="15" y="40" fontSize="17">
            {symbol}
          </text>
          <g transform="rotate(180 50 72)">
            <text x="15" y="23" fontSize={card.rank === '10' ? 17 : 21}>
              {card.rank}
            </text>
            <text x="15" y="40" fontSize="17">
              {symbol}
            </text>
          </g>
          {PIPS[card.rank] ? (
            PIPS[card.rank].map(([x, y], index) => (
              <text
                key={index}
                x={x}
                y={y}
                dominantBaseline="central"
                fontSize="24"
                transform={y > 72 ? `rotate(180 ${x} ${y})` : undefined}
              >
                {symbol}
              </text>
            ))
          ) : (
            <text x="50" y={court ? 77 : 93} fontSize={court ? 44 : 61}>
              {court ? card.rank : symbol}
            </text>
          )}
          {court ? (
            <text x="50" y="102" fontSize="26">
              {symbol}
            </text>
          ) : null}
        </g>
      )}
    </svg>
  )
}
