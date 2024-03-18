import loadable from '@loadable/component';
import PageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const AnnouncementsList = loadable(
  () => import('./components/AnnouncementsList'),
);

const AnnouncementsRoute: RouteObject[] = [
  { index: true, Component: AnnouncementsList },
  { path: '*', children: PageNotFound },
];

export default AnnouncementsRoute;
