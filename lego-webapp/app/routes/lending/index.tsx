import { lazyComponent } from '~/utils/lazyComponent';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router';

const LendableObjectsList = lazyComponent(
  () => import('./components/LendableObjectList'),
);
const LendableObjectDetail = lazyComponent(
  () => import('./components/LendableObjectDetail'),
);
const LendableObjectEdit = lazyComponent(
  () => import('./components/LendableObjectEdit'),
);
const LendableObjectCreate = lazyComponent(
  () => import('./components/LendableObjectCreate'),
);

const LendingRequestCreate = lazyComponent(
  () => import('./components/LendingRequestCreate')
)

const lendingRoute: RouteObject[] = [
  { index: true, lazy: LendableObjectsList },
  { path: ':lendableObjectId', lazy: LendableObjectDetail },
  { path: ':lendableObjectId/edit', lazy: LendableObjectEdit },
  { path: 'new', lazy: LendableObjectCreate },
  { path: ':lendableObjectId/create', lazy: LendingRequestCreate },
  { path: '*', children: pageNotFound },
];

export default lendingRoute;
