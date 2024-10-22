import loadable from '@loadable/component';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const LendableObjectsList = loadable(
  () => import('./components/LendableObjectList'),
);
const LendableObjectDetail = loadable(
  () => import('./components/LendableObjectDetail'),
);

const lendingRoute: RouteObject[] = [
  { index: true, Component: LendableObjectsList },
  { path: ':lendableObjectId', Component: LendableObjectDetail },
  { path: '*', children: pageNotFound },
];

export default lendingRoute;
