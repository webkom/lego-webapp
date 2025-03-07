import { Page } from '@webkom/lego-bricks';
import { PropsWithChildren } from 'react';
import { Helmet } from 'react-helmet-async';
import { NavigationTab } from '~/components/NavigationTab/NavigationTab';

const EmailRouteWrapper = ({ children }: PropsWithChildren) => (
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

    {children}
  </Page>
);

export default EmailRouteWrapper;
