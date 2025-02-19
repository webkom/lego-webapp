import { lazyComponent } from 'app/utils/lazyComponent';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router';

const PageEditor = lazyComponent(() => import('./components/PageEditor'));
const PageDetail = lazyComponent(() => import('./components/PageDetail'));

const pagesRoute: RouteObject[] = [
  { path: 'new', lazy: PageEditor },
  { path: ':section', lazy: PageDetail },
  { path: ':section/:pageSlug', lazy: PageDetail },
  { path: ':section/:pageSlug/edit', lazy: PageEditor },
  { path: '*', children: pageNotFound },
];

export default pagesRoute;
