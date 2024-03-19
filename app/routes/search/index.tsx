import loadable from '@loadable/component';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const SearchPageWrapper = loadable(() => import('./SearchPageWrapper'));

const searchRoute: RouteObject[] = [
  { index: true, Component: SearchPageWrapper },
  { path: '*', children: pageNotFound },
];

export default searchRoute;
