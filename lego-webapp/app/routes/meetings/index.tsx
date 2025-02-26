import { lazyComponent } from '~/utils/lazyComponent';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router';

const MeetingList = lazyComponent(() => import('./components/MeetingList'));
const MeetingEditor = lazyComponent(() => import('./components/MeetingEditor'));
const MeetingDetailWrapper = lazyComponent(
  () => import('./MeetingDetailWrapper'),
);

const meetingsRoute: RouteObject[] = [
  { index: true, lazy: MeetingList },
  { path: 'create', lazy: MeetingEditor },
  { path: ':meetingId', lazy: MeetingDetailWrapper },
  { path: ':meetingId/edit', lazy: MeetingEditor },
  { path: '*', children: pageNotFound },
];

export default meetingsRoute;
