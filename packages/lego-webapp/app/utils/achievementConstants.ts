import type { AchievementData } from '~/redux/models/User';

export const rarityToColorMap = {
  0: 'Sienna',
  1: 'Silver',
  2: 'Gold',
  3: '#2f9cc5',
  4: '#0fdee0',
  5: 'MediumSeaGreen',
  6: '#911b1b',
  7: 'Crimson',
  8: '#9340FF',
  9: '#BF00FF',
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
      rarity: 6,
      hidden: false,
    },
  ],
  event_rank: [
    {
      name: 'Arrangement:\nMester',
      description: '3. plass - flest arrangementer',
      rarity: 7,
      hidden: false,
    },
    {
      name: 'Arrangement:\nIkon',
      description: '2. plass - flest arrangementer',
      rarity: 8,
      hidden: false,
    },
    {
      name: 'Arrangement:\nFyrtårn',
      description: '1. plass - flest arrangementer',
      rarity: 9,
      hidden: false,
    },
  ],
  quote_count: [
    {
      name: 'Psssst',
      description: '',
      rarity: 1,
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
      rarity: 5,
      hidden: false,
    },
  ],
  event_rules: [
    {
      name: 'Skaffe tre',
      description: 'Lest arrangementsreglene',
      rarity: 0,
      hidden: false,
    },
  ],
  meeting_hidden: [
    {
      name: 'Er det noen her?',
      description: '',
      rarity: 1,
      hidden: true,
    },
  ],
  keypress_order: [
    {
      name: 'Powermode\nactivate!',
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
  penalty_period: [
    {
      name: 'Pliktoppfyllende',
      description: 'Gått 1 år uten prikk',
      rarity: 0,
      hidden: false,
    },
    {
      name: 'Englebarn',
      description: 'Gått 2 år uten prikk',
      rarity: 3,
      hidden: false,
    },
    {
      name: 'Eksemplarisk',
      description: 'Gått 3 år uten prikk',
      rarity: 5,
      hidden: false,
    },
    {
      name: 'Flink pike',
      description: 'Gått 4 år uten prikk',
      rarity: 6,
      hidden: false,
    },
  ],
};

export default AchievementsInfo;
