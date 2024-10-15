// achievementData.ts

import type { AchievementData } from 'app/store/models/User';

const AchievementsInfo: Record<string, AchievementData[]> = {
  event_count: [
    {
      name: 'Arrangement: Bronse',
      description: 'Deltatt på 10 arrangementer',
    },
    {
      name: 'Arrangement: Sølv',
      description: 'Deltatt på 25 arrangementer',
    },
    {
      name: 'Arrangement: Gull',
      description: 'Deltatt på 50 arrangementer',
    },
    {
      name: 'Arrangement: Platinum',
      description: 'Deltatt på 100 arrangementer',
    },
    {
      name: 'Arrangement: Legende',
      description: 'Deltatt på 200 arrangementer',
    },
  ],
  event_rank: [
    {
      name: 'Arrangement: Mester',
      description: '#3 Flest arrangementer',
    },
    {
      name: 'Arrangement: Ikon',
      description: '#2 Flest arrangementer',
    },
    {
      name: 'Arrangement: Fyrtårn',
      description: '#1 Flest arrangementer',
    },
  ],
  quote_count: [
    {
      name: 'Psssst',
      description: '',
    },
  ],
  event_price: [
    {
      name: 'Pappapenger',
      description: 'Har betalt over 2500 i påmelding.',
    },
    {
      name: 'Arvingen',
      description: 'Har betalt over 5000 i påmelding.',
    },
    {
      name: 'Bærumsbaron',
      description: 'Har betalt over 10.000 i påmelding.',
    },
  ],
  meeting_hidden: [
    {
      name: 'Er det noen her?',
      description: '',
    },
  ],
};

export default AchievementsInfo;
