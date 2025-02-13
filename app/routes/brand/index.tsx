import { lazyComponent } from 'app/utils/lazyComponent';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router';

const BrandPage = lazyComponent(() => import('./components/BrandPage'));

const brandRoute: RouteObject[] = [
  { index: true, lazy: BrandPage },
  { path: '*', children: pageNotFound },
];

export default brandRoute;
