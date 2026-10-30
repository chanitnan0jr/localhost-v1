import type { JMove, Mood, State } from './types'
import { JOKER_MAX_HP, MAX_SP, PLAYER_MAX_HP } from './rules'

type Lines = Readonly<Record<Mood, string>>

// Idle lines also answer unknown commands outside a duel, so they never assume one is running.
export const JOKER_LINES: Readonly<Record<string, Lines>> = {
  sudo: {
    idle: 'Admin rights? How bold. I slipped those out of the sudoers file before you arrived.',
    smug: "Elevated privileges won't rescue this hand. I pocketed them an hour ago.",
    hurt: 'Admin rights as well? Please, leave a weary card a little dignity.',
    charging: "Permission denied. Kindly hold that thought; I'm preparing something special.",
  },
  'rm -rf': {
    idle: 'Erase everything? I prefer to take things quietly, never to destroy them.',
    smug: "Deleting the evidence won't change the score. I keep excellent records.",
    hurt: "Clearing the table while you're ahead? How generous. Still, no.",
    charging: 'Nothing gets deleted mid-shuffle. The deck stays exactly as I arranged it.',
  },
  'kill dragon': {
    idle: "No dragons in this deck, I'm afraid. Only kings, queens and one uninvited guest.",
    smug: "A dragon? Let's settle our little card game first, then we'll talk dragons.",
    hurt: 'Leave the dragon in peace. One weary card is quite enough for one evening.',
    charging: "Dragons can wait. I'm saving my grandest flourish for you.",
  },
  ls: {
    idle: 'Fifty-two cards, all accounted for. Curious how I never make the list.',
    smug: 'List what you like. The card that matters is the one doing the talking.',
    hurt: 'Nothing in this directory for a creased card, sadly. I did check.',
    charging: "Directory listing paused. Keep your eyes on the deck; I'm nearly ready.",
  },
  whoami: {
    idle: 'You are my honored guest. I am the Joker card, the one no deck remembers ordering.',
    smug: 'A brave guest who is, for the moment, a few points behind. Only for the moment.',
    hurt: 'You are the guest who has me rather crumpled. Well played, truly.',
    charging: 'You are my audience for the next trick. Do watch closely.',
  },
  cat: {
    idle: "That file seems to have gone missing. I can't imagine who took it.",
    smug: "Reading won't change the score, but do make yourself comfortable.",
    hurt: 'Reading up on my weak points? Fair. You seem to have found most of them already.',
    charging: "Read quickly. The next page is something I've been saving for you.",
  },
  exit: {
    idle: 'Leaving so soon? Stay a moment; the night is young and the deck is freshly shuffled.',
    smug: "Slipping away while I'm ahead? Stay a moment; the tide can still turn.",
    hurt: "Leaving now, just as you're winning? I'd be relieved, but you'd regret it.",
    charging: "Leaving before the finale? You'd miss the best trick of the evening.",
  },
  hello: {
    idle: "Good evening, dear guest. Count the deck sometime; you'll find one card too many.",
    smug: 'Hello again. Shall we pretend that last move went exactly as you planned?',
    hurt: "Hello to you too. Do forgive my appearance; it's been a demanding game.",
    charging: 'Hello, and do keep your eyes open. Something special is about to be dealt.',
  },
  rm: {
    idle: 'Removing things? I only ever borrow. Deleting seems so impolite.',
    smug: "Delete what you like; the score is kept somewhere you can't reach.",
    hurt: "If you're removing my creases, please, go right ahead.",
    charging: "No files leave this table while I'm shuffling. Patience, please.",
  },
  cheat: {
    idle: 'Cheating? Kindly leave the sleight of hand to the professional.',
    smug: "Tricks are my department, I'm afraid. Yours is honest, determined play.",
    hurt: "Cheating against a card that's already creased? Unnecessary, but flattering.",
    charging: "Too late for tricks. I've had one up my sleeve for several turns now.",
  },
  steal: {
    idle: "Stealing from a thief? I'd be flattered if my pockets weren't already empty.",
    smug: "A lovely attempt. I'm afraid I lifted your best card before you reached for it.",
    hurt: "Take what you like. I've little left to lose this evening.",
    charging: 'Hands off the deck, please. That card is reserved for my finale.',
  },
  shuffle: {
    idle: 'Shuffle all you like. Somehow I always turn up where nobody expects.',
    smug: "Reshuffling won't help. I already know where every card landed.",
    hurt: 'A fresh shuffle? Yes, please. This hand has been unkind to me.',
    charging: "No need to shuffle. I've already arranged the next card myself.",
  },
  git: {
    idle: 'git blame points to me. For once, the tooling is entirely correct.',
    smug: 'Commit this to memory: the score, and who is ahead.',
    hurt: 'If only I could revert the last few turns. Your commits were rather good.',
    charging: "Stage your changes now. My next move won't be a small patch.",
  },
  please: {
    idle: "Such lovely manners. Sadly, politeness opens no locks I haven't opened first.",
    smug: 'Asking nicely? Charming. The answer is still a polite no.',
    hurt: "Since you asked so nicely, I'll admit it: you're playing very well.",
    charging: "Manners noted. They won't soften what comes next, but they are appreciated.",
  },
}

export const JOKER_DEFAULT: Lines = {
  idle: "I don't know that trick, and I know a great many. Do try another.",
  smug: 'Inventive, but the house only deals attack, defend, evade or counter.',
  hurt: "Whatever that was, I'll gladly take the breather. Thank you kindly.",
  charging: 'Fascinating. Meanwhile, my next card grows more impressive by the second.',
}

export function jokerReply(input: string, mood: Mood): string {
  const command = input.trim().replace(/\s+/g, ' ').toLowerCase()
  if (!command) return ''
  // Own keys only, so input such as 'constructor' cannot reach Object.prototype.
  const keys = Object.keys(JOKER_LINES)
  const key =
    keys.find((k) => k === command) ??
    // Multi-word keys also match as a prefix: 'rm -rf /' uses 'rm -rf'.
    keys.find((k) => k.includes(' ') && command.startsWith(k)) ??
    keys.find((k) => k === command.split(' ')[0])
  return (key ? JOKER_LINES[key] : JOKER_DEFAULT)[mood]
}

// Exact for whole numbers, so 9 of 30 is 30% rather than a float on either side of it.
const percent = (value: number, max: number) => (value * 100) / max

export function moodFor(s: State, lastJMove?: JMove): Mood {
  if (percent(s.jhp, JOKER_MAX_HP) <= 30) return 'hurt'
  if (percent(s.jsp, MAX_SP) >= 80 || lastJMove === 'charge') return 'charging'
  if (lastJMove === 'crit' || lastJMove === 'ultimate' || percent(s.hp, PLAYER_MAX_HP) <= 30) return 'smug'
  return 'idle'
}
