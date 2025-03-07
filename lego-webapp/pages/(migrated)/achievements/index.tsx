import { lazyComponent } from '~/utils/lazyComponent';
import type { RouteObject } from 'react-router';

const Leaderboard = lazyComponent(() => import('./leaderboard/+Page'));
const Overview = lazyComponent(() => import('./+Page'));

const achievementRoute: RouteObject[] = [
  {
    path: '',
    children: [
      { index: true, lazy: Overview },
      { path: 'leaderboard', lazy: Leaderboard },
    ],
  },
];

export default achievementRoute;
