import { Helmet } from 'react-helmet-async';
import { Content } from 'app/components/Content';
import NavigationTab from 'app/components/NavigationTab';
import NavigationLink from 'app/components/NavigationTab/NavigationLink';
import type { PropsWithChildren } from 'react';

const EmailPage = ({ children }: PropsWithChildren) => (
  <Content>
    <Helmet title="E-post" />
    <NavigationTab title="E-post">
      <NavigationLink to="/admin/email">Lister</NavigationLink>
      <NavigationLink to='/admin/email/users?filters={"internalEmailEnabled"%3A"true"}'>
        Brukere
      </NavigationLink>
      <NavigationLink to="/admin/email/restricted">
        Begrenset e-post
      </NavigationLink>
    </NavigationTab>
    {children}
  </Content>
);

export default EmailPage;
