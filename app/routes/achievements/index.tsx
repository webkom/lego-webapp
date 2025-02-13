import { convert } from 'app/utils/convertRoute';
import type { RouteObject } from 'react-router';

const achievementRoute: RouteObject[] = [
  {
    path: '',
    lazy: () => import('./route').then(convert),
    children: [
      {
        index: true,
        lazy: () => import('../achievements._index/route').then(convert),
      },
      {
        path: 'leaderboard',
        lazy: () => import('../achievements.leaderboard/route').then(convert),
      },
    ],
  },
];

export default achievementRoute;
