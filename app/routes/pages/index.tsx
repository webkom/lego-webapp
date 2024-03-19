import loadable from '@loadable/component';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const PageEditor = loadable(() => import('./components/PageEditor'));
const PageDetail = loadable(() => import('./components/PageDetail'));

const pagesRoute: RouteObject[] = [
  { path: 'new', Component: PageEditor },
  { path: ':section', Component: PageDetail },
  { path: ':section/:pageSlug', Component: PageDetail },
  { path: ':section/:pageSlug/edit', Component: PageEditor },
  { path: '*', children: pageNotFound },
];

export default pagesRoute;
