import { lazyComponent } from 'app/utils/lazyComponent';
import type { RouteObject } from 'react-router';

const Leaderboard = lazyComponent(() => import('./components/Leaderboard'));
const Overview = lazyComponent(() => import('./components/Overview'));
const AchievementsPageWrapper = lazyComponent(
  () => import('./components/index'),
);

const achievementRoute: RouteObject[] = [
  {
    path: '',
    lazy: AchievementsPageWrapper,
    children: [
      { index: true, lazy: Overview },
      { path: 'leaderboard', lazy: Leaderboard },
    ],
  },
];

export default achievementRoute;
