import { Page } from '@webkom/lego-bricks';
import { Helmet } from 'react-helmet-async';
import { Navigate, Outlet, type RouteObject } from 'react-router';
import { NavigationTab } from 'app/components/NavigationTab/NavigationTab';
import { lazyComponent } from 'app/utils/lazyComponent';
import pageNotFound from '../../pageNotFound';

const EmailLists = lazyComponent(() => import('./components/EmailLists'));
const EmailListEditor = lazyComponent(
  () => import('./components/EmailListEditor'),
);
const EmailUsers = lazyComponent(() => import('./components/EmailUsers'));
const EmailUserEditor = lazyComponent(
  () => import('./components/EmailUserEditor'),
);
const RestrictedMails = lazyComponent(
  () => import('./components/RestrictedMails'),
);
const RestrictedMailEditor = lazyComponent(
  () => import('./components/RestrictedMailEditor'),
);
const EmailRouteWrapper = () => (
  <Page
    title="Administer e-post"
    tabs={
      <>
        <NavigationTab href="/admin/email/lists" matchSubpages>
          Lister
        </NavigationTab>
        <NavigationTab href="/admin/email/users?enabled=true" matchSubpages>
          Brukere
        </NavigationTab>
        <NavigationTab href="/admin/email/restricted" matchSubpages>
          Begrenset e-post
        </NavigationTab>
      </>
    }
  >
    <Helmet title="E-post" />

    <Outlet />
  </Page>
);

const emailRoute: RouteObject[] = [
  {
    Component: EmailRouteWrapper,
    children: [
      { index: true, element: <Navigate to="lists" replace /> },
      { path: 'lists', lazy: EmailLists },
      { path: 'lists/new', lazy: EmailListEditor },
      { path: 'lists/:emailListId', lazy: EmailListEditor },
      { path: 'users', lazy: EmailUsers },
      { path: 'users/new', lazy: EmailUserEditor },
      { path: 'users/:emailUserId', lazy: EmailUserEditor },
      { path: 'restricted', lazy: RestrictedMails },
      { path: 'restricted/new', lazy: RestrictedMailEditor },
      { path: 'restricted/:restrictedMailId', lazy: RestrictedMailEditor },
    ],
  },
  { path: '*', children: pageNotFound },
];

export default emailRoute;
