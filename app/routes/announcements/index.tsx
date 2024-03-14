import loadable from '@loadable/component';
import { type RouteObject } from 'react-router-dom';

const AnnouncementsList = loadable(() => import('./components/AnnouncementsList'));
const PageNotFound = loadable(() => import('../pageNotFound'))

const AnnouncementsRoute: RouteObject[] = [
  { index: true, Component: AnnouncementsList },
  { path: "*", Component: PageNotFound }
];

export default AnnouncementsRoute;
