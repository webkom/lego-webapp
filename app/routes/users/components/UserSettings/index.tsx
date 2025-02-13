import { type RouteObject } from 'react-router';
import pageNotFound from 'app/routes/pageNotFound';
import { lazyComponent } from 'app/utils/lazyComponent';

const UserSettingsIndex = lazyComponent(() => import('./UserSettingsIndex'));
const UserSettings = lazyComponent(() => import('./UserSettings'));
const UserSettingsNotifications = lazyComponent(
  () => import('./UserSettingsNotifications'),
);
const UserSettingsOAuth2 = lazyComponent(() => import('./UserSettingsOAuth2'));
const UserSettingsOAuth2Form = lazyComponent(
  () => import('./UserSettingsOAuth2Form'),
);
const StudentConfirmation = lazyComponent(
  () => import('./StudentConfirmation'),
);

const userSettingsRoute: RouteObject[] = [
  {
    lazy: UserSettingsIndex,
    children: [
      { path: 'profile', lazy: UserSettings },
      { path: 'notifications', lazy: UserSettingsNotifications },
      {
        path: 'oauth2/*',
        children: [
          { index: true, lazy: UserSettingsOAuth2 },
          { path: 'new', lazy: UserSettingsOAuth2Form },
          { path: ':applicationId', lazy: UserSettingsOAuth2Form },
        ],
      },
      { path: 'student-confirmation', lazy: StudentConfirmation },
    ],
  },
  { path: '*', children: pageNotFound },
];

export default userSettingsRoute;
