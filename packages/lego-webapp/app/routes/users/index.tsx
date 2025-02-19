import { lazyComponent } from 'app/utils/lazyComponent';
import pageNotFound from '../pageNotFound';
import userSettingsRoute from './components/UserSettings';
import type { RouteObject } from 'react-router';

const UserConfirmationForm = lazyComponent(
  () => import('./components/UserConfirmation'),
);
const UserResetPasswordForm = lazyComponent(
  () => import('./components/UserResetPassword'),
);
const UserProfile = lazyComponent(() => import('./components/UserProfile'));

const usersRoute: RouteObject[] = [
  { path: 'registration', lazy: UserConfirmationForm },
  { path: 'reset-password', lazy: UserResetPasswordForm },
  { path: ':username', lazy: UserProfile },
  { path: ':username/settings/*', children: userSettingsRoute },
  { path: '*', children: pageNotFound },
];

export default usersRoute;
