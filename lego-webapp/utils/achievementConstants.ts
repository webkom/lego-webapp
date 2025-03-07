import trofe_aktiv_bidragsyter_1 from 'assets/trophies/trofe_aktiv_bidragsyter_1.png';
import trofe_aktiv_bidragsyter_2 from 'assets/trophies/trofe_aktiv_bidragsyter_2.png';
import trofe_aktiv_bidragsyter_3 from 'assets/trophies/trofe_aktiv_bidragsyter_3.png';
import trofe_sjeldenhetsgrad_1 from 'assets/trophies/trofe_sjeldenhetsgrad_1.png';
import trofe_sjeldenhetsgrad_10 from 'assets/trophies/trofe_sjeldenhetsgrad_10.png';
import trofe_sjeldenhetsgrad_2 from 'assets/trophies/trofe_sjeldenhetsgrad_2.png';
import trofe_sjeldenhetsgrad_3 from 'assets/trophies/trofe_sjeldenhetsgrad_3.png';
import trofe_sjeldenhetsgrad_4 from 'assets/trophies/trofe_sjeldenhetsgrad_4.png';
import trofe_sjeldenhetsgrad_5 from 'assets/trophies/trofe_sjeldenhetsgrad_5.png';
import trofe_sjeldenhetsgrad_6 from 'assets/trophies/trofe_sjeldenhetsgrad_6.png';
import trofe_sjeldenhetsgrad_7 from 'assets/trophies/trofe_sjeldenhetsgrad_7.png';
import trofe_sjeldenhetsgrad_8 from 'assets/trophies/trofe_sjeldenhetsgrad_8.png';
import trofe_sjeldenhetsgrad_9 from 'assets/trophies/trofe_sjeldenhetsgrad_9.png';

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
      image: trofe_sjeldenhetsgrad_1,
    },
    {
      name: 'Arrangement:\nSølv',
      description: 'Deltatt på 25 arrangementer',
      rarity: 1,
      hidden: false,
      image: trofe_sjeldenhetsgrad_2,
    },
    {
      name: 'Arrangement:\nGull',
      description: 'Deltatt på 50 arrangementer',
      rarity: 2,
      hidden: false,
      image: trofe_sjeldenhetsgrad_3,
    },
    {
      name: 'Arrangement:\nPlatinum',
      description: 'Deltatt på 100 arrangementer',
      rarity: 3,
      hidden: false,
      image: trofe_sjeldenhetsgrad_4,
    },
    {
      name: 'Arrangement:\nDiamant',
      description: 'Deltatt på 150 arrangementer',
      rarity: 4,
      hidden: false,
      image: trofe_sjeldenhetsgrad_5,
    },
    {
      name: 'Arrangement:\nLegende',
      description: 'Deltatt på 200 arrangementer',
      rarity: 6,
      hidden: false,
      image: trofe_sjeldenhetsgrad_7,
    },
  ],
  event_rank: [
    {
      name: 'Arrangement:\nMester',
      description: '3. plass - flest arrangementer',
      rarity: 7,
      hidden: false,
      image: trofe_sjeldenhetsgrad_8,
    },
    {
      name: 'Arrangement:\nIkon',
      description: '2. plass - flest arrangementer',
      rarity: 8,
      hidden: false,
      image: trofe_sjeldenhetsgrad_9,
    },
    {
      name: 'Arrangement:\nFyrtårn',
      description: '1. plass - flest arrangementer',
      rarity: 9,
      hidden: false,
      image: trofe_sjeldenhetsgrad_10,
    },
  ],
  quote_count: [
    {
      name: 'Psssst',
      description: '',
      rarity: 1,
      hidden: true,
      image: trofe_sjeldenhetsgrad_2,
    },
  ],
  event_price: [
    {
      name: 'Fæffæ betaler',
      description: 'Betalt over 2500 i påmeldingsavgift',
      rarity: 2,
      hidden: false,
      image: trofe_sjeldenhetsgrad_3,
    },
    {
      name: 'Arvingen',
      description: 'Betalt over 5000 i påmeldingsavgift',
      rarity: 3,
      hidden: false,
      image: trofe_sjeldenhetsgrad_4,
    },
    {
      name: 'Bærumsbaron',
      description: 'Betalt over 10.000 i påmeldingsavgift',
      rarity: 5,
      hidden: false,
      image: trofe_sjeldenhetsgrad_6,
    },
  ],
  event_rules: [
    {
      name: 'Skaffe tre',
      description: 'Lest arrangementsreglene',
      rarity: 0,
      hidden: false,
      image: trofe_sjeldenhetsgrad_1,
    },
  ],
  meeting_hidden: [
    {
      name: 'Er det noen her?',
      description: '',
      rarity: 1,
      hidden: true,
      image: trofe_sjeldenhetsgrad_2,
    },
  ],
  keypress_order: [
    {
      name: 'Powermode\nactivated!',
      description: '',
      rarity: 2,
      hidden: true,
      image: trofe_sjeldenhetsgrad_3,
    },
  ],
  complete_profile: [
    {
      name: 'Komplett spiller',
      description: '',
      rarity: 1,
      hidden: true,
      image: trofe_sjeldenhetsgrad_2,
    },
  ],
  poll_count: [
    {
      name: 'Aktiv Deltaker',
      description: 'Svart på 5 avstemninger',
      rarity: 0,
      hidden: false,
      image: trofe_aktiv_bidragsyter_1,
    },
    {
      name: 'Meningsbærer',
      description: 'Svart på 25 avstemninger',
      rarity: 2,
      hidden: false,
      image: trofe_aktiv_bidragsyter_2,
    },
    {
      name: 'Talsperson',
      description: 'Svart på 50 avstemninger',
      rarity: 4,
      hidden: false,
      image: trofe_aktiv_bidragsyter_3,
    },
  ],
  penalty_period: [
    {
      name: 'Pliktoppfyllende',
      description: 'Gått 1 år uten prikk',
      rarity: 0,
      hidden: false,
      image: trofe_sjeldenhetsgrad_1,
    },
    {
      name: 'Englebarn',
      description: 'Gått 2 år uten prikk',
      rarity: 3,
      hidden: false,
      image: trofe_sjeldenhetsgrad_4,
    },
    {
      name: 'Eksemplarisk',
      description: 'Gått 3 år uten prikk',
      rarity: 5,
      hidden: false,
      image: trofe_sjeldenhetsgrad_6,
    },
    {
      name: 'Flink pike',
      description: 'Gått 4 år uten prikk',
      rarity: 6,
      hidden: false,
      image: trofe_sjeldenhetsgrad_7,
    },
  ],
  genfors_count: [
    {
      name: 'Demokratispiren',
      description: 'Deltatt på 1 genfors',
      rarity: 0,
      hidden: false,
      image: trofe_sjeldenhetsgrad_1,
    },
    {
      name: 'Voteringvikingen',
      description: 'Deltatt på 3 genfors',
      rarity: 2,
      hidden: false,
      image: trofe_sjeldenhetsgrad_3,
    },
    {
      name: 'Politikeren',
      description: 'Deltatt på 6 genfors',
      rarity: 4,
      hidden: false,
      image: trofe_sjeldenhetsgrad_5,
    },
    {
      name: 'Studentenes\nforkjemper',
      description: 'Deltatt på 8 genfors',
      rarity: 5,
      hidden: false,
      image: trofe_sjeldenhetsgrad_6,
    },
    {
      name: 'Ekstremisten',
      description: 'Deltatt på 10 genfors',
      rarity: 7,
      hidden: false,
      image: trofe_sjeldenhetsgrad_8,
    },
  ],
};

export default AchievementsInfo;
