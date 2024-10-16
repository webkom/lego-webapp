import loadable from '@loadable/component';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const LendableObjectsList = loadable(
  () => import('./components/LendableObjectList'),
);

const lendingRoute: RouteObject[] = [
  { index: true, Component: LendableObjectsList },
  { path: '*', children: pageNotFound },
];

export default lendingRoute;
