import loadable from '@loadable/component';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const ArticleList = loadable(() => import('./components/ArticleList'));
const ArticleEditor = loadable(() => import('./components/ArticleEditor'));
const ArticleDetail = loadable(() => import('./components/ArticleDetail'));

const articleRoute: RouteObject[] = [
  { index: true, Component: ArticleList },
  { path: 'new', Component: ArticleEditor },
  { path: ':articleIdOrSlug', Component: ArticleDetail },
  { path: ':articleId/edit', Component: ArticleEditor },
  { path: '*', children: pageNotFound },
];

export default articleRoute;
