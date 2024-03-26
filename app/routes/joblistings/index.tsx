import loadable from '@loadable/component';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const JoblistingsPage = loadable(() => import('./components/JoblistingPage'));
const JoblistingEditor = loadable(
  () => import('./components/JoblistingEditor'),
);
const JoblistingDetail = loadable(
  () => import('./components/JoblistingDetail'),
);

const joblistingsRoute: RouteObject[] = [
  { index: true, Component: JoblistingsPage },
  { path: 'create', Component: JoblistingEditor },
  { path: ':joblistingIdOrSlug', Component: JoblistingDetail },
  { path: ':joblistingId/edit', Component: JoblistingEditor },
  { path: '*', children: pageNotFound },
];
export default joblistingsRoute;
