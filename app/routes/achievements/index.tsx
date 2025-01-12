import loadable from '@loadable/component';
import type { RouteObject } from 'react-router-dom';

const Leaderboard = loadable(() => import('./components/Leaderboard'));
const Overview = loadable(() => import('./components/Overview'));
const AchievementsPageWrapper = loadable(() => import('./components/index'));

const achievementRoute: RouteObject[] = [
  {
    path: '',
    Component: AchievementsPageWrapper,
    children: [
      { index: true, Component: Overview },
      { path: 'overview', Component: Overview },
      { path: 'leaderboard', Component: Leaderboard },
    ],
  },
];

export default achievementRoute;
