import { lazyComponent } from 'app/utils/lazyComponent';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router';

const AnnouncementsList = lazyComponent(
  () => import('./components/AnnouncementsList'),
);

const announcementsRoute: RouteObject[] = [
  { index: true, lazy: AnnouncementsList },
  { path: '*', children: pageNotFound },
];

export default announcementsRoute;
