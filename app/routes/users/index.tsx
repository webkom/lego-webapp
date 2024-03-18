import loadable from '@loadable/component';
import PageNotFound from '../pageNotFound';
import UserSettingsRoute from './components/UserSettingsIndex';
import type { RouteObject } from 'react-router-dom';

const UserConfirmationForm = loadable(
  () => import('./components/UserConfirmation'),
);
const UserResetPasswordForm = loadable(
  () => import('./components/UserResetPassword'),
);
const UserProfile = loadable(() => import('./components/UserProfile'));

const UsersRoute: RouteObject[] = [
  { path: 'registration', Component: UserConfirmationForm },
  { path: 'reset-password', Component: UserResetPasswordForm },
  { path: ':username', Component: UserProfile },
  { path: ':username/settings/*', children: UserSettingsRoute },
  { path: '*', children: PageNotFound },
];

export default UsersRoute;
