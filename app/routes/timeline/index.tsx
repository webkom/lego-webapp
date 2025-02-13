import { lazyComponent } from 'app/utils/lazyComponent';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router';

const TimelinePage = lazyComponent(() => import('./components/TimelinePage'));

const timelineRoute: RouteObject[] = [
  { index: true, lazy: TimelinePage },
  { path: '*', children: pageNotFound },
];

export default timelineRoute;
