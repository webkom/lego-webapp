import loadable from '@loadable/component';
import PageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const ForumDetail = loadable(() => import('./components/ForumDetail'));
const ForumEditor = loadable(() => import('./components/ForumEditor'));
const ThreadDetail = loadable(() => import('./components/ThreadDetail'));
const ThreadEditor = loadable(() => import('./components/ThreadEditor'));
const ForumList = loadable(() => import('./components/ForumList'));

const ForumRoute: RouteObject[] = [
  { index: true, Component: ForumList },
  { path: ':forumId/threads', Component: ForumDetail },
  { path: 'new', Component: ForumEditor },
  { path: ':forumId/edit', Component: ForumEditor },
  { path: ':forumId/threads/:threadId', Component: ThreadDetail },
  { path: ':forumId/new', Component: ThreadEditor },
  { path: ':forumId/threads/:threadId/edit', Component: ThreadEditor },
  { path: '*', children: PageNotFound },
];

export default ForumRoute;
