import loadable from '@loadable/component';
import PageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const ArticleList = loadable(() => import('./components/ArticleList'));
const ArticleEditor = loadable(() => import('./components/ArticleEditor'));
const ArticleDetail = loadable(() => import('./components/ArticleDetail'));

const ArticleRoute: RouteObject[] = [
  { index: true, Component: ArticleList },
  { path: 'new', Component: ArticleEditor },
  { path: ':articleIdOrSlug', Component: ArticleDetail },
  { path: ':articleId/edit', Component: ArticleEditor },
  { path: '*', children: PageNotFound },
];

export default ArticleRoute;
