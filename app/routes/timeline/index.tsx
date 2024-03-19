import loadable from '@loadable/component';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const TimelinePage = loadable(() => import('./components/TimelinePage'));

const timelineRoute: RouteObject[] = [
  { index: true, Component: TimelinePage },
  { path: '*', children: pageNotFound },
];

export default timelineRoute;
