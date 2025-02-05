import loadable from '@loadable/component';
import pageNotFound from '../pageNotFound';
import userSettingsRoute from './components/UserSettings';
import type { RouteObject } from 'react-router-dom';

const UserConfirmationForm = loadable(
  () => import('./components/UserConfirmation'),
);
const UserResetPasswordForm = loadable(
  () => import('./components/UserResetPassword'),
);
const UserProfile = loadable(() => import('./components/UserProfile'));

const usersRoute: RouteObject[] = [
  { path: 'registration', Component: UserConfirmationForm },
  { path: 'reset-password', Component: UserResetPasswordForm },
  { path: ':username', Component: UserProfile },
  { path: ':username/settings/*', children: userSettingsRoute },
  { path: '*', children: pageNotFound },
];

export default usersRoute;
