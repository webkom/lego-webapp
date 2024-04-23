import loadable from '@loadable/component';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const PollsList = loadable(() => import('./components/PollsList'));
const PollCreator = loadable(() => import('./components/PollEditor'), {
  resolveComponent: (components) => components.PollCreator,
});
const PollDetail = loadable(() => import('./components/PollDetail'));

const pollsRoute: RouteObject[] = [
  { index: true, Component: PollsList },
  { path: 'new', Component: PollCreator },
  { path: ':pollsId', Component: PollDetail },
  { path: '*', children: pageNotFound },
];

export default pollsRoute;
