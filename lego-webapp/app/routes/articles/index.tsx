import { lazyComponent } from '~/utils/lazyComponent';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router';

const ArticleList = lazyComponent(() => import('./components/ArticleList'));
const ArticleEditor = lazyComponent(() => import('./components/ArticleEditor'));
const ArticleDetail = lazyComponent(() => import('./components/ArticleDetail'));

const articleRoute: RouteObject[] = [
  { index: true, lazy: ArticleList },
  { path: 'new', lazy: ArticleEditor },
  { path: ':articleIdOrSlug', lazy: ArticleDetail },
  { path: ':articleId/edit', lazy: ArticleEditor },
  { path: '*', children: pageNotFound },
];

export default articleRoute;
