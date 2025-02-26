import { lazyComponent } from '~/utils/lazyComponent';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router';

const TagCloud = lazyComponent(() => import('./components/TagCloud'));
const TagDetail = lazyComponent(() => import('./components/TagDetail'));

const tagsRoute: RouteObject[] = [
  { index: true, lazy: TagCloud },
  { path: ':tagId', lazy: TagDetail },
  { path: '*', children: pageNotFound },
];

export default tagsRoute;
