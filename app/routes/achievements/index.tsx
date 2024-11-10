import loadable from '@loadable/component';
import type { RouteObject } from 'react-router-dom';

const Leaderboard = loadable(() => import('./components/Leaderboard'));
const Overview = loadable(() => import('./components/Overview'));

const achievementRoute: RouteObject[] = [
  { index: true, Component: Leaderboard },
  { path: 'leaderboard', Component: Leaderboard },
  { path: 'overview', Component: Overview },
];

export default achievementRoute;
