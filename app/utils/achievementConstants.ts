import type { AchievementData } from 'app/store/models/User';

export const rarityToColorMap = {
  0: 'Sienna',
  1: 'Silver',
  2: 'Gold',
  3: '#2f9cc5',
  4: '#0fdee0',
  5: '#780606',  // Dark red
  6: 'MediumSeaGreen',
  7: '#911b1b',
  8: 'Crimson',
  9: '#9340FF',
  10: '#BF00FF',
};

const AchievementsInfo: Record<string, AchievementData[]> = {
  event_count: [
    {
      name: 'Arrangement:\nBronse',
      description: 'Deltatt på 10 arrangementer',
      rarity: 0,
      hidden: false,
    },
    {
      name: 'Arrangement:\nSølv',
      description: 'Deltatt på 25 arrangementer',
      rarity: 1,
      hidden: false,
    },
    {
      name: 'Arrangement:\nGull',
      description: 'Deltatt på 50 arrangementer',
      rarity: 2,
      hidden: false,
    },
    {
      name: 'Arrangement:\nPlatinum',
      description: 'Deltatt på 100 arrangementer',
      rarity: 3,
      hidden: false,
    },
    {
      name: 'Arrangement:\nDiamant',
      description: 'Deltatt på 150 arrangementer',
      rarity: 4,
      hidden: false,
    },
    {
      name: 'Arrangement:\nLegende',
      description: 'Deltatt på 200 arrangementer',
      rarity: 7,
      hidden: false,
    },
  ],
  event_rank: [
    {
      name: 'Arrangement:\nMester',
      description: '3. plass - flest arrangementer',
      rarity: 8,
      hidden: false,
    },
    {
      name: 'Arrangement:\nIkon',
      description: '2. plass - flest arrangementer',
      rarity: 9,
      hidden: false,
    },
    {
      name: 'Arrangement:\nFyrtårn',
      description: '1. plass - flest arrangementer',
      rarity: 10,
      hidden: false,
    },
  ],
  quote_count: [
    {
      name: 'Psssst',
      description: '',
      rarity: 2,
      hidden: true,
    },
  ],
  event_price: [
    {
      name: 'Fæffæ betaler',
      description: 'Betalt over 2500 i påmeldingsavgift',
      rarity: 2,
      hidden: false,
    },
    {
      name: 'Arvingen',
      description: 'Betalt over 5000 i påmeldingsavgift',
      rarity: 3,
      hidden: false,
    },
    {
      name: 'Bærumsbaron',
      description: 'Betalt over 10.000 i påmeldingsavgift',
      rarity: 6,
      hidden: false,
    },
  ],
  meeting_hidden: [
    {
      name: 'Er det noen her?',
      description: '',
      rarity: 2,
      hidden: true,
    },
  ],
  poll_count: [
    {
      name: 'Aktiv Deltaker',
      description: 'Svart på 5 avstemninger',
      rarity: 0,
      hidden: false,
    },
    {
      name: 'Meningsbærer',
      description: 'Svart på 25 avstemninger',
      rarity: 2,
      hidden: false,
    },
    {
      name: 'Talsperson',
      description: 'Svart på 50 avstemninger',
      rarity: 4,
      hidden: false,
    },
  ],
  penalty_count: [
    {
      name: 'Bølle',
      description: 'Fått 1 prikk',
      rarity: 0,
      hidden: false,
    },
    {
      name: 'Cancelled',
      description: 'Fått 5 prikker',
      rarity: 3,
      hidden: false,
    },
    {
      name: 'Kriminell',
      description: 'Fått 10 prikker',
      rarity: 5,
      hidden: false,
    },
  ]
};

export default AchievementsInfo;
