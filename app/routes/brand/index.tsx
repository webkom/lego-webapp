import loadable from '@loadable/component';
import PageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const BrandPage = loadable(() => import('./components/BrandPage'));

const BrandRoute: RouteObject[] = [
  { index: true, Component: BrandPage },
  { path: '*', children: PageNotFound },
];

export default BrandRoute;
