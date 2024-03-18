import loadable from '@loadable/component';
import PageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const PageEditor = loadable(() => import('./components/PageEditor'));
const PageDetail = loadable(() => import('./components/PageDetail'));

const PagesRoute: RouteObject[] = [
  { path: 'new', Component: PageEditor },
  { path: ':section', Component: PageDetail },
  { path: ':section/:pageSlug', Component: PageDetail },
  { path: ':section/:pageSlug/edit', Component: PageEditor },
  { path: '*', children: PageNotFound },
];

export default PagesRoute;
