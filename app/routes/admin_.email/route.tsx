import { Page } from '@webkom/lego-bricks';
import { Helmet } from 'react-helmet-async';
import { Outlet } from 'react-router';
import { NavigationTab } from 'app/components/NavigationTab/NavigationTab';

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

export default EmailRouteWrapper;
