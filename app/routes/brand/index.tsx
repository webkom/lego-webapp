import loadable from '@loadable/component';
import { type RouteObject } from 'react-router-dom';

const BrandPage = loadable(() => import('./components/BrandPage'));
const PageNotFound = loadable(() => import('../pageNotFound'));

const BrandRoute: RouteObject[] = [
  { index: true, Component: BrandPage },
  { path: '*', Component: PageNotFound },
];

export default BrandRoute;
