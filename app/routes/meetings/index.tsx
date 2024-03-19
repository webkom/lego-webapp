import loadable from '@loadable/component';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const MeetingList = loadable(() => import('./components/MeetingList'));
const MeetingEditor = loadable(() => import('./components/MeetingEditor'));
const MeetingDetailWrapper = loadable(() => import('./MeetingDetailWrapper'));

const meetingsRoute: RouteObject[] = [
  { index: true, Component: MeetingList },
  { path: 'create', Component: MeetingEditor },
  { path: ':meetingId', Component: MeetingDetailWrapper },
  { path: ':meetingId/edit', Component: MeetingEditor },
  { path: '*', children: pageNotFound },
];

export default meetingsRoute;
