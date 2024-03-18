import loadable from '@loadable/component';
import PageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const SearchPageWrapper = loadable(() => import('./SearchPageWrapper'));

const SearchRoute: RouteObject[] = [
  { index: true, Component: SearchPageWrapper },
  { path: '*', children: PageNotFound },
];

export default SearchRoute;
