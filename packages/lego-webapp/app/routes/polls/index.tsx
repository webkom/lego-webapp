import { lazyComponent } from 'app/utils/lazyComponent';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router';

const PollsList = lazyComponent(() => import('./components/PollsList'));
const PollCreator = lazyComponent(() => import('./components/PollEditor'), {
  resolveComponent: (components) => components.PollCreator,
});
const PollDetail = lazyComponent(() => import('./components/PollDetail'));

const pollsRoute: RouteObject[] = [
  { index: true, lazy: PollsList },
  { path: 'new', lazy: PollCreator },
  { path: ':pollsId', lazy: PollDetail },
  { path: '*', children: pageNotFound },
];

export default pollsRoute;
