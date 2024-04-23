import loadable from '@loadable/component';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const AnnouncementsList = loadable(
  () => import('./components/AnnouncementsList'),
);

const announcementsRoute: RouteObject[] = [
  { index: true, Component: AnnouncementsList },
  { path: '*', children: pageNotFound },
];

export default announcementsRoute;
