import easter_contender_25 from 'assets/trophies/easter-contender-trophy-25.png';
import easter_winner_24 from 'assets/trophies/easter-winner-trophy-24.png';
import easter_winner_25 from 'assets/trophies/easter-winner-trophy-25.png';
import trofe_aktiv_bidragsyter_1 from 'assets/trophies/trofe_aktiv_bidragsyter_1.png';
import trofe_aktiv_bidragsyter_2 from 'assets/trophies/trofe_aktiv_bidragsyter_2.png';
import trofe_aktiv_bidragsyter_3 from 'assets/trophies/trofe_aktiv_bidragsyter_3.png';
import trofe_rank_1 from 'assets/trophies/trofe_rank_1.png';
import trofe_sjeldenhetsgrad_1 from 'assets/trophies/trofe_sjeldenhetsgrad_1.png';
import trofe_sjeldenhetsgrad_10 from 'assets/trophies/trofe_sjeldenhetsgrad_10.png';
import trofe_sjeldenhetsgrad_2 from 'assets/trophies/trofe_sjeldenhetsgrad_2.png';
import trofe_sjeldenhetsgrad_3 from 'assets/trophies/trofe_sjeldenhetsgrad_3.png';
import trofe_sjeldenhetsgrad_4 from 'assets/trophies/trofe_sjeldenhetsgrad_4.png';
import trofe_sjeldenhetsgrad_5 from 'assets/trophies/trofe_sjeldenhetsgrad_5.png';
import trofe_sjeldenhetsgrad_8 from 'assets/trophies/trofe_sjeldenhetsgrad_8.png';
import type { AchievementData, Rarity } from '~/redux/models/User';

export const rarityMap: Record<Rarity, { name: string; color: string }> = {
  0: { name: 'Vanlig', color: 'Sienna' }, // Bronze
  1: { name: 'Uvanlig', color: 'Silver' }, // Silver
  2: { name: 'Sjelden', color: '#dcaf18' }, // Gold
  3: { name: 'Obskur', color: '#2f9cc5' }, // Platinum
  4: { name: 'Episk', color: '#0fdee0' }, // Diamond
  5: { name: 'Mytisk', color: '#7f20b8' },
  6: { name: 'Legendarisk', color: '#911b1b' },
};

export const AchievementIdentifier = {
  event_count: 'event_count',
  event_rank: 'event_rank',
  quote_count: 'quote_count',
  event_price: 'event_price',
  event_rules: 'event_rules',
  meeting_hidden: 'meeting_hidden',
  keypress_order: 'keypress_order',
  complete_profile: 'complete_profile',
  poll_count: 'poll_count',
  penalty_period: 'penalty_period',
  genfors_count: 'genfors_count',
  gala_count: 'gala_count',
  easter_winner: 'easter_winner',
} as const;

export type AchievementIdentifier =
  (typeof AchievementIdentifier)[keyof typeof AchievementIdentifier];

export const HIDDEN_DESCRIPTION = '?????????';

export const AchievementsInfo: Record<
  AchievementIdentifier,
  AchievementData[]
> = {
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
      image: trofe_sjeldenhetsgrad_8,
    },
  ],
  event_rank: [
    {
      name: 'Arrangement:\nMester',
      description: '3. plass - flest arrangementer',
      rarity: 5,
      hidden: false,
      image: trofe_sjeldenhetsgrad_10,
    },
    {
      name: 'Arrangement:\nStormester',
      description: '2. plass - flest arrangementer',
      rarity: 5,
      hidden: false,
      image: trofe_sjeldenhetsgrad_10,
    },
    {
      name: 'Arrangement:\nFyrtårn',
      description: '1. plass - flest arrangementer',
      rarity: 6,
      hidden: false,
      image: trofe_rank_1,
    },
  ],
  quote_count: [
    {
      name: 'Psssst',
      description: HIDDEN_DESCRIPTION,
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
      rarity: 4,
      hidden: false,
      image: trofe_sjeldenhetsgrad_5,
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
      description: HIDDEN_DESCRIPTION,
      rarity: 1,
      hidden: true,
      image: trofe_sjeldenhetsgrad_2,
    },
  ],
  keypress_order: [
    {
      name: 'Powermode\nactivated!',
      description: HIDDEN_DESCRIPTION,
      rarity: 2,
      hidden: true,
      image: trofe_sjeldenhetsgrad_3,
    },
  ],
  complete_profile: [
    {
      name: 'Komplett spiller',
      description: HIDDEN_DESCRIPTION,
      rarity: 0,
      hidden: true,
      image: trofe_sjeldenhetsgrad_1,
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
      rarity: 1,
      hidden: false,
      image: trofe_sjeldenhetsgrad_2,
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
      rarity: 4,
      hidden: false,
      image: trofe_sjeldenhetsgrad_5,
    },
    {
      name: 'Flink pike',
      description: 'Gått 4 år uten prikk',
      rarity: 5,
      hidden: false,
      image: trofe_sjeldenhetsgrad_10,
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
      rarity: 3,
      hidden: false,
      image: trofe_sjeldenhetsgrad_4,
    },
    {
      name: 'Studentenes\nforkjemper',
      description: 'Deltatt på 8 genfors',
      rarity: 4,
      hidden: false,
      image: trofe_sjeldenhetsgrad_5,
    },
    {
      name: 'Ekstremisten',
      description: 'Deltatt på 10 genfors',
      rarity: 5,
      hidden: false,
      image: trofe_sjeldenhetsgrad_10,
    },
  ],
  gala_count: [
    {
      name: 'Festløve',
      description: 'Deltatt på 1 galla',
      rarity: 0,
      hidden: false,
      image: trofe_sjeldenhetsgrad_1,
    },
    {
      name: 'Gallaholiker',
      description: 'Deltatt på 5 gallaer',
      rarity: 2,
      hidden: false,
      image: trofe_sjeldenhetsgrad_3,
    },
    {
      name: 'Daljeh*re',
      description: 'Deltatt på 10 gallaer',
      rarity: 4,
      hidden: false,
      image: trofe_sjeldenhetsgrad_5,
    },
    {
      name: 'Ordensmedlem',
      description: 'Deltatt på 15 gallaer',
      rarity: 5,
      hidden: false,
      image: trofe_sjeldenhetsgrad_10,
    },
  ],
  easter_winner: [
    {
      name: 'Påskeeggjakten 2024\nVinner',
      description: 'Vinner - påskeeggjakten 2024',
      rarity: 2,
      hidden: false,
      image: easter_winner_24,
    },
    {
      name: 'Påskeeggjakten 2025\nUtfordrer',
      description: 'Utfordrer - påskeeggjakten 2025',
      rarity: 1,
      hidden: false,
      image: easter_contender_25,
    },
    {
      name: 'Påskeeggjakten 2025\nVinner',
      description: 'Vinner - påskeeggjakten 2025',
      rarity: 2,
      hidden: false,
      image: easter_winner_25,
    },
  ],
};

export type DetailedAchievementData = AchievementData & { level?: number };

export type AchievementGroupInfo = {
  identifier: AchievementIdentifier;
  name: string;
  description?: string;
  userAchievedLevel?: number;
  achievements: DetailedAchievementData[];
  isLeveled: boolean; // Does requirements(level2) => requirements(level1)
};

// Name and description defined here function as default values
// and may be overridden by the achievements own name and description
export const GroupedAchievementsInfo: AchievementGroupInfo[] = [
  {
    identifier: 'event_count',
    name: 'Arrangement deltakelse',
    description: 'Deltatt på X arrangementer',
    achievements: AchievementsInfo['event_count'],
    isLeveled: true,
  },
  {
    identifier: 'event_rank',
    name: 'Arrangement rangering',
    description: 'Plassering i antall arrangementer',
    achievements: AchievementsInfo['event_rank'],
    isLeveled: true,
  },
  {
    identifier: 'event_price',
    name: 'Arrangement betaling',
    description: 'Betalt over X i påmeldingsavgift',
    achievements: AchievementsInfo['event_price'],
    isLeveled: true,
  },
  {
    identifier: 'event_rules',
    name: 'Arrangement regler',
    description: 'Lest arrangementsreglene',
    achievements: AchievementsInfo['event_rules'],
    isLeveled: true,
  },
  {
    identifier: 'poll_count',
    name: 'Avstemninger',
    description: 'Svart på X avstemninger',
    achievements: AchievementsInfo['poll_count'],
    isLeveled: true,
  },
  {
    identifier: 'penalty_period',
    name: 'Prikk',
    description: 'Gått X år uten prikk',
    achievements: AchievementsInfo['penalty_period'],
    isLeveled: true,
  },
  {
    identifier: 'genfors_count',
    name: 'Genfors',
    description: 'Deltatt på X genfors',
    achievements: AchievementsInfo['genfors_count'],
    isLeveled: true,
  },
  {
    identifier: 'gala_count',
    name: 'Galla',
    description: 'Deltatt på X gallaer',
    achievements: AchievementsInfo['gala_count'],
    isLeveled: true,
  },
  {
    // hidden
    identifier: 'meeting_hidden',
    name: 'Er det noen her?',
    description: HIDDEN_DESCRIPTION,
    achievements: AchievementsInfo['meeting_hidden'],
    isLeveled: true,
  },
  {
    // hidden
    identifier: 'keypress_order',
    name: 'Powermode activated!',
    description: HIDDEN_DESCRIPTION,
    achievements: AchievementsInfo['keypress_order'],
    isLeveled: true,
  },
  {
    // hidden
    identifier: 'complete_profile',
    name: 'Komplett spiller',
    description: HIDDEN_DESCRIPTION,
    achievements: AchievementsInfo['complete_profile'],
    isLeveled: true,
  },
  {
    // hidden
    identifier: 'quote_count',
    name: 'Psssst',
    description: HIDDEN_DESCRIPTION,
    achievements: AchievementsInfo['quote_count'],
    isLeveled: true,
  },
  {
    identifier: 'easter_winner',
    name: 'Webkom Påskeeggjakt',
    description: "Vinnere av Webkom's påskeeggjakt",
    achievements: AchievementsInfo['easter_winner'],
    isLeveled: false,
  },
];

export default AchievementsInfo;
