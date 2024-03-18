import loadable from '@loadable/component';
import PageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const PollsList = loadable(() => import('./components/PollsList'));
const PollCreator = loadable(() => import('./components/PollEditor'), {
  resolveComponent: (components) => components.PollCreator,
});
const PollDetail = loadable(() => import('./components/PollDetail'));

const PollsRoute: RouteObject[] = [
  { index: true, Component: PollsList },
  { path: 'new', Component: PollCreator },
  { path: ':pollsId', Component: PollDetail },
  { path: '*', children: PageNotFound },
];

export default PollsRoute;
