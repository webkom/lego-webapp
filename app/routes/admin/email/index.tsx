import loadable from '@loadable/component';
import { Page } from '@webkom/lego-bricks';
import { Helmet } from 'react-helmet-async';
import { Outlet, type RouteObject } from 'react-router-dom';
import { NavigationTab } from 'app/components/NavigationTab/NavigationTab';
import pageNotFound from '../../pageNotFound';

const EmailLists = loadable(() => import('./components/EmailLists'));
const EmailListEditor = loadable(() => import('./components/EmailListEditor'));
const EmailUsers = loadable(() => import('./components/EmailUsers'));
const EmailUserEditor = loadable(() => import('./components/EmailUserEditor'));
const RestrictedMails = loadable(() => import('./components/RestrictedMails'));
const RestrictedMailEditor = loadable(
  () => import('./components/RestrictedMailEditor'),
);
const EmailRouteWrapper = () => (
  <Page
    title="Administer E-post"
    tabs={
      <>
        <NavigationTab href="/admin/email">Lister</NavigationTab>
        <NavigationTab href="/admin/email/users?enabled=true">
          Brukere
        </NavigationTab>
        <NavigationTab href="/admin/email/restricted">
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
      { index: true, Component: EmailLists },
      { path: 'lists', Component: EmailLists },
      { path: 'lists/new', Component: EmailListEditor },
      { path: 'lists/:emailListId', Component: EmailListEditor },
      { path: 'users', Component: EmailUsers },
      { path: 'users/new', Component: EmailUserEditor },
      { path: 'users/:emailUserId', Component: EmailUserEditor },
      { path: 'restricted', Component: RestrictedMails },
      { path: 'restricted/new', Component: RestrictedMailEditor },
      { path: 'restricted/:restrictedMailId', Component: RestrictedMailEditor },
    ],
  },
  { path: '*', children: pageNotFound },
];

export default emailRoute;
