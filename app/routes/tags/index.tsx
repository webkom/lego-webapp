import loadable from '@loadable/component';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const TagCloud = loadable(() => import('./components/TagCloud'));
const TagDetail = loadable(() => import('./components/TagDetail'));

const tagsRoute: RouteObject[] = [
  { index: true, Component: TagCloud },
  { path: ':tagId', Component: TagDetail },
  { path: '*', children: pageNotFound },
];

export default tagsRoute;
