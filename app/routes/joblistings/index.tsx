import { lazyComponent } from 'app/utils/lazyComponent';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const JoblistingsPage = lazyComponent(
  () => import('./components/JoblistingPage'),
);
const JoblistingEditor = lazyComponent(
  () => import('./components/JoblistingEditor'),
);
const JoblistingDetail = lazyComponent(
  () => import('./components/JoblistingDetail'),
);

const joblistingsRoute: RouteObject[] = [
  { index: true, lazy: JoblistingsPage },
  { path: 'create', lazy: JoblistingEditor },
  { path: ':joblistingIdOrSlug', lazy: JoblistingDetail },
  { path: ':joblistingId/edit', lazy: JoblistingEditor },
  { path: '*', children: pageNotFound },
];
export default joblistingsRoute;
