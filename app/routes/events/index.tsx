import loadable from '@loadable/component';
import { Route, Routes } from 'react-router-dom';

const EventDetail = loadable(() => import('./components/EventDetail'));
const EventEditor = loadable(() => import('./components/EventEditor'));
const EventAdministrateRoute = loadable(
  () => import('./components/EventAdministrate'),
);
const PageNotFound = loadable(() => import('../pageNotFound'));
const Calendar = loadable(() => import('./components/Calendar'));
const EventList = loadable(() => import('./components/EventList'));

const EventsRoute = () => (
  <Routes>
    <Route index element={<EventList />} />
    <Route path="calendar/:year?/:month?" element={<Calendar />} />
    <Route path="create" element={<EventEditor />} />
    <Route path=":eventIdOrSlug" element={<EventDetail />} />
    <Route path=":eventIdOrSlug/edit" element={<EventEditor />} />
    <Route
      path=":eventId/administrate/*"
      element={<EventAdministrateRoute />}
    />
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default EventsRoute;
