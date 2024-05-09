import loadable from '@loadable/component';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const LendableObjectsList = loadable(
  () => import('./components/LendableObjectsList'),
);
const LendableObjectEdit = loadable(
  () => import('./components/LendableObjectEdit'),
);
const LendableObjectDetail = loadable(
  () => import('./components/LendableObjectDetail'),
);
const LendableObjectAdminDetail = loadable(
  () => import('./components/LendableObjectAdminDetail'),
);
const LendingAdmin = loadable(() => import('./components/LendingAdmin'));
const LendingRequest = loadable(() => import('./components/LendingRequest'));
const LendingRequestAdmin = loadable(
  () => import('./components/LendingRequestAdmin'),
);

const lendingRoute: RouteObject[] = [
  { index: true, Component: LendableObjectsList },
  { path: 'create', Component: LendableObjectEdit },
  { path: ':lendableObjectId', Component: LendableObjectDetail },
  { path: ':lendableObjectId/edit', Component: LendableObjectEdit },
  { path: ':lendableObjectId/admin', Component: LendableObjectAdminDetail },
  { path: 'admin', Component: LendingAdmin },
  { path: 'request/:lendingRequestId', Component: LendingRequest },
  { path: 'request/:lendingRequestId/admin', Component: LendingRequestAdmin },
  { path: '*', children: pageNotFound },
];

export default lendingRoute;
