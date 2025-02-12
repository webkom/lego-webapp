import { lazyComponent } from 'app/utils/lazyComponent';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const WrappedValidator = lazyComponent(() => import('./WrappedValidator'));

const validatorRoute: RouteObject[] = [
  { index: true, lazy: WrappedValidator },
  { path: '*', children: pageNotFound },
];

export default validatorRoute;
