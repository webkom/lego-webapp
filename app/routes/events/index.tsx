import loadable from '@loadable/component';
import PageNotFound from '../pageNotFound';
import EventAdministrateRoute from './components/EventAdministrate';
import type { RouteObject } from 'react-router-dom';

const Calendar = loadable(() => import('./components/Calendar'));
const EventDetail = loadable(() => import('./components/EventDetail'));
const EventEditor = loadable(() => import('./components/EventEditor'));
const EventList = loadable(() => import('./components/EventList'));

const EventsRoute: RouteObject[] = [
  { index: true, Component: EventList },
  { path: 'calendar/:year?/:month?', Component: Calendar },
  { path: 'create', Component: EventEditor },
  { path: ':eventIdOrSlug', Component: EventDetail },
  { path: ':eventIdOrSlug/edit', Component: EventEditor },
  { path: ':eventId/administrate/*', children: EventAdministrateRoute },
  { path: '*', children: PageNotFound },
];

export default EventsRoute;
