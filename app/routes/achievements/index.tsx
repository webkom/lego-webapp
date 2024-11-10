import loadable from '@loadable/component';
import type { RouteObject } from 'react-router-dom';

const Leaderboard = loadable(() => import('./components/Leaderboard'));
const Overview = loadable(() => import('./components/Overview'));

const achievementRoute: RouteObject[] = [
  { index: true, Component: Overview },
  { path: 'overview', Component: Overview },
  { path: 'leaderboard', Component: Leaderboard },
];

export default achievementRoute;
