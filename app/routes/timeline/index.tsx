import loadable from '@loadable/component';
import PageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const TimelinePage = loadable(() => import('./components/TimelinePage'));

const TimelineRoute: RouteObject[] = [
  { index: true, Component: TimelinePage },
  { path: '*', children: PageNotFound },
];

export default TimelineRoute;
