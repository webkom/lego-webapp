// @flow

import type { Node } from 'react';
import { Helmet } from 'react-helmet-async';

import { Content } from 'app/components/Content';
import NavigationTab from 'app/components/NavigationTab';
import NavigationLink from 'app/components/NavigationTab/NavigationLink';

type Props = {
  children: Node,
};

const EmailPage = ({ children }: Props) => (
  <Content>
    <Helmet title="E-post" />
    <NavigationTab title="E-post">
      <NavigationLink to="/admin/email">Lister</NavigationLink>
      <NavigationLink to='/admin/email/users?filters={"internalEmailEnabled"%3A"true"}'>
        Brukere
      </NavigationLink>
      <NavigationLink to="/admin/email/restricted">
        Begrenset epost
      </NavigationLink>
    </NavigationTab>
    {children}
  </Content>
);

export default EmailPage;
