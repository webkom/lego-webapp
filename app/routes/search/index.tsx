import { lazyComponent } from 'app/utils/lazyComponent';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const SearchPageWrapper = lazyComponent(() => import('./SearchPageWrapper'));

const searchRoute: RouteObject[] = [
  { index: true, lazy: SearchPageWrapper },
  { path: '*', children: pageNotFound },
];

export default searchRoute;
