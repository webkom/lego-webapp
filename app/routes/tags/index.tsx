import loadable from '@loadable/component';
import PageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const TagCloud = loadable(() => import('./components/TagCloud'));
const TagDetail = loadable(() => import('./components/TagDetail'));

const TagsRoute: RouteObject[] = [
  { index: true, Component: TagCloud },
  { path: ':tagId', Component: TagDetail },
  { path: '*', children: PageNotFound },
];

export default TagsRoute;
