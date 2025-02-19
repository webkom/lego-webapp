import { lazyComponent } from 'app/utils/lazyComponent';
import pageNotFound from '../pageNotFound';
import eventAdministrateRoute from './components/EventAdministrate';
import type { RouteObject } from 'react-router';

const Calendar = lazyComponent(() => import('./components/Calendar'));
const EventDetail = lazyComponent(() => import('./components/EventDetail'));
const EventEditor = lazyComponent(() => import('./components/EventEditor'));
const EventList = lazyComponent(() => import('./components/EventList'));
const EventsOverview = lazyComponent(
  () => import('./components/EventsOverview'),
);

const eventsRoute: RouteObject[] = [
  {
    path: '',
    lazy: EventsOverview,
    children: [
      { index: true, lazy: EventList },
      { path: 'calendar/:year?/:month?', lazy: Calendar },
    ],
  },
  { path: 'create', lazy: EventEditor },
  { path: ':eventIdOrSlug', lazy: EventDetail },
  { path: ':eventIdOrSlug/edit', lazy: EventEditor },
  { path: ':eventId/administrate/*', children: eventAdministrateRoute },
  { path: '*', children: pageNotFound },
];

export default eventsRoute;
