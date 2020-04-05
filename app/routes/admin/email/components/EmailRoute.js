// @flow

import React, { type Node } from 'react';
import NavigationTab from 'app/components/NavigationTab';
import NavigationLink from 'app/components/NavigationTab/NavigationLink';
import { Content } from 'app/components/Content';

type Props = {
  children: Node
};

const EmailPage = ({ children }: Props) => (
  <Content>
    <NavigationTab title="Epost">
      <NavigationLink to={'/admin/email'}>Lister</NavigationLink>
      <NavigationLink to={'/admin/email/users'}>Brukere</NavigationLink>
      <NavigationLink to={'/admin/email/restricted'}>
        Begrenset epost
      </NavigationLink>
    </NavigationTab>
    {children}
  </Content>
);

export default EmailPage;
