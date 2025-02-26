import { lazyComponent } from '~/utils/lazyComponent';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router';

const ForumDetail = lazyComponent(() => import('./components/ForumDetail'));
const ForumEditor = lazyComponent(() => import('./components/ForumEditor'));
const ThreadDetail = lazyComponent(() => import('./components/ThreadDetail'));
const ThreadEditor = lazyComponent(() => import('./components/ThreadEditor'));
const ForumList = lazyComponent(() => import('./components/ForumList'));

const forumRoute: RouteObject[] = [
  { index: true, lazy: ForumList },
  { path: ':forumId/threads', lazy: ForumDetail },
  { path: 'new', lazy: ForumEditor },
  { path: ':forumId/edit', lazy: ForumEditor },
  { path: ':forumId/threads/:threadId', lazy: ThreadDetail },
  { path: ':forumId/new', lazy: ThreadEditor },
  { path: ':forumId/threads/:threadId/edit', lazy: ThreadEditor },
  { path: '*', children: pageNotFound },
];

export default forumRoute;
