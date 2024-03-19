import loadable from '@loadable/component';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const WrappedValidator = loadable(() => import('./WrappedValidator'));

const validatorRoute: RouteObject[] = [
  { index: true, Component: WrappedValidator },
  { path: '*', children: pageNotFound },
];

export default validatorRoute;
