import loadable from '@loadable/component';
import { Helmet } from 'react-helmet-async';
import { Outlet, type RouteObject } from 'react-router-dom';
import { Content } from 'app/components/Content';
import NavigationTab from 'app/components/NavigationTab';
import NavigationLink from 'app/components/NavigationTab/NavigationLink';
import PageNotFound from '../../pageNotFound';

const EmailLists = loadable(() => import('./components/EmailLists'));
const EmailListEditor = loadable(() => import('./components/EmailListEditor'));
const EmailUsers = loadable(() => import('./components/EmailUsers'));
const EmailUserEditor = loadable(() => import('./components/EmailUserEditor'));
const RestrictedMails = loadable(() => import('./components/RestrictedMails'));
const RestrictedMailEditor = loadable(
  () => import('./components/RestrictedMailEditor'),
);
const EmailRouteWrapper = () => (
  <Content>
    <Helmet title="E-post" />
    <NavigationTab title="E-post">
      <NavigationLink to="/admin/email">Lister</NavigationLink>
      <NavigationLink to="/admin/email/users?enabled=true">
        Brukere
      </NavigationLink>
      <NavigationLink to="/admin/email/restricted">
        Begrenset e-post
      </NavigationLink>
    </NavigationTab>

    <Outlet />
  </Content>
);

const EmailRoute: RouteObject[] = [
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
  { path: '*', children: PageNotFound },
];

export default EmailRoute;
