import loadable from '@loadable/component';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const BrandPage = loadable(() => import('./components/BrandPage'));

const brandRoute: RouteObject[] = [
  { index: true, Component: BrandPage },
  { path: '*', children: pageNotFound },
];

export default brandRoute;
