import loadable from '@loadable/component';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const LendableObjectsList = loadable(
  () => import('./components/LendableObjectList'),
);
const LendableObjectDetail = loadable(
  () => import('./components/LendableObjectDetail'),
);
const LendableObjectEdit = loadable(
  () => import('./components/LendableObjectEdit'),
);
const LendableObjectCreate = loadable(
  () => import('./components/LendableObjectCreate'),
);

const lendingRoute: RouteObject[] = [
  { index: true, Component: LendableObjectsList },
  { path: ':lendableObjectId', Component: LendableObjectDetail },
  { path: ':lendableObjectId/edit', Component: LendableObjectEdit },
  { path: 'new', Component: LendableObjectCreate },
  { path: '*', children: pageNotFound },
];

export default lendingRoute;
