import loadable from '@loadable/component';
import PageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const WrappedValidator = loadable(() => import('./WrappedValidator'));

const ValidatorRoute: RouteObject[] = [
  { index: true, Component: WrappedValidator },
  { path: '*', children: PageNotFound },
];

export default ValidatorRoute;
