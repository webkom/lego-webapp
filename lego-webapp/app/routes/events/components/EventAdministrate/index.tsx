import { type RouteObject } from 'react-router';
import pageNotFound from 'app/routes/pageNotFound';
import { lazyComponent } from '~/utils/lazyComponent';

const EventAdministrateIndex = lazyComponent(
  () => import('./EventAdministrateIndex'),
);
const Statistics = lazyComponent(() => import('./Statistics'));
const Attendees = lazyComponent(() => import('./Attendees'));
const Allergies = lazyComponent(() => import('./Allergies'));
const AdminRegister = lazyComponent(() => import('./AdminRegister'));
const Abacard = lazyComponent(() => import('./Abacard'));

const eventAdministrateRoute: RouteObject[] = [
  {
    lazy: EventAdministrateIndex,
    children: [
      { path: 'attendees', lazy: Attendees },
      { path: 'allergies', lazy: Allergies },
      { path: 'statistics', lazy: Statistics },
      { path: 'admin-register', lazy: AdminRegister },
      { path: 'abacard', lazy: Abacard },
    ],
  },
  { path: '*', children: pageNotFound },
];

export default eventAdministrateRoute;
