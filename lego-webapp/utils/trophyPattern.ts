import casinoSvg from 'assets/trophies/casino_26_winner_trophy.svg?raw';
import type { Achievement } from '~/redux/models/User';

const FINISHES: Record<string, string[]> = {
  Onyx: ['#404142', '#2b2c2d', '#7a7c7e', '#696a6c', '#8d8f8f'],
  Mahogni: ['#5a2e1c', '#3a1d12', '#8a5236', '#74432b', '#9c6342'],
  Spillebord: ['#1d5a3a', '#123d27', '#3f8a61', '#2f7550', '#52a074'],
  Midnatt: ['#1f2a4f', '#141b35', '#3d4f86', '#304070', '#52649c'],
  Fløyel: ['#6b1530', '#460c1f', '#9c3355', '#84264a', '#b04468'],
};

// [finish, cards left to right, hand]
const PATTERNS = [
  ['Onyx', '2♥ 10♥ A♥', 'Flush'],
  ['Mahogni', '2♥ A♠ 3♣', 'Straight'],
  ['Spillebord', '5♦ 4♣ 3♦', 'Straight'],
  ['Spillebord', '4♥ 6♥ K♦', 'Høyt kort'],
  ['Midnatt', '6♦ 6♥ K♥', 'Par'],
  ['Spillebord', '3♠ 8♣ K♥', 'Høyt kort'],
  ['Mahogni', '2♥ K♥ 10♣', 'Høyt kort'],
  ['Fløyel', 'A♥ A♠ A♦', 'Tre ess'],
  ['Onyx', '8♣ Q♣ 4♦', 'Høyt kort'],
  ['Onyx', '7♠ 5♠ 9♥', 'Høyt kort'],
];

const PLINTH_CLASSES = [12, 7, 1, 9, 13];

const HEART =
  'M0,34 C-46,2 -50,-36 -22,-44 C-8,-48 0,-36 0,-28 C0,-36 8,-48 22,-44 C50,-36 46,2 0,34 Z';

const SUITS: Record<string, { color: string; shape: string }> = {
  '♥': { color: '#d32f2f', shape: `<path d="${HEART}"/>` },
  '♦': { color: '#d32f2f', shape: '<path d="M0,-46 L32,0 L0,46 L-32,0 Z"/>' },
  '♣': {
    color: '#1f1f24',
    shape:
      '<circle cx="0" cy="-22" r="20"/><circle cx="-22" cy="6" r="20"/><circle cx="22" cy="6" r="20"/><circle cx="0" cy="-2" r="16"/><path d="M-9,0 L9,0 L16,44 L-16,44 Z"/>',
  },
  '♠': {
    color: '#1f1f24',
    shape: `<path d="${HEART}" transform="translate(0 -8) scale(1 -1)"/><path d="M-7,10 L7,10 L16,44 L-16,44 Z"/>`,
  },
};

const CARD_SLOTS = [
  { rotate: -22, x: 535, y: 52, sx: 110, sy: 125 },
  { rotate: 0, x: 636, y: 22, sx: 135, sy: 145 },
  { rotate: 22, x: 737, y: 52, sx: 125, sy: 125 },
];

const cardSvg = (card: string, i: number) => {
  const { rotate, x, y, sx, sy } = CARD_SLOTS[i];
  const { color, shape } = SUITS[card.slice(-1)];
  return `<g transform="rotate(${rotate} ${x + 115} ${y + 420})"><rect x="${x}" y="${y}" width="230" height="320" rx="22" fill="#fbfaf6" stroke="#2b2c2d" stroke-width="6"/><text x="${x + 22}" y="${y + 64}" font-family="Georgia, 'Times New Roman', serif" font-weight="bold" font-size="58" fill="${color}">${card.slice(0, -1)}</text><g fill="${color}" transform="translate(${x + sx} ${y + sy}) scale(1.4)">${shape}</g></g>`;
};

const buildSkin = (pattern: number) => {
  const [finish, label, hand] = PATTERNS[pattern];
  const cards = label.split(' ');
  let svg = casinoSvg.replace(
    /<g id="Cards">.*\n/,
    `<g id="Cards">${[0, 2, 1].map((i) => cardSvg(cards[i], i)).join('')}</g>\n`,
  );
  PLINTH_CLASSES.forEach((cls, i) => {
    svg = svg.replace(
      new RegExp(`(\\.cls-${cls} \\{\\s*fill: )#[0-9a-f]{6}`),
      `$1${FINISHES[finish][i]}`,
    );
  });
  return {
    pattern,
    finish,
    label,
    hand,
    image: 'data:image/svg+xml,' + encodeURIComponent(svg),
  };
};

const skins = new Map<number, ReturnType<typeof buildSkin>>();

export const getTrophySkin = (achievement: Achievement) => {
  if (achievement.identifier !== 'charity_event_2026') return undefined;
  const pattern = achievement.id % PATTERNS.length;
  if (!skins.has(pattern)) skins.set(pattern, buildSkin(pattern));
  return skins.get(pattern);
};
