// @flow

import React, { type Node } from 'react';
import NavigationTab from 'app/components/NavigationTab';
import NavigationLink from 'app/components/NavigationTab/NavigationLink';
import Content from 'app/components/Layout/Content';
import { Link } from 'react-router';

type Props = {
  children: Node,
  groups: Array<Object>,
  location: { pathname: string },
  params: { groupId: string }
};

const CreateAction = ({ pathname }: { pathname: string }) => {
  switch (pathname) {
    case '/admin/email/lists':
      return (
        <Link to={`/admin/email/lists/new`} style={{ float: 'right' }}>
          Ny epostliste
        </Link>
      );
    case '/admin/email/users':
      return (
        <Link to={'/admin/email/users/new'} style={{ float: 'right' }}>
          Ny bruker
        </Link>
      );
    case '/admin/email/restricted':
      return (
        <Link to={'/admin/email/restricted/new'} style={{ float: 'right' }}>
          Ny begrenset epost
        </Link>
      );
    default:
      return null;
  }
};

const EmailPage = ({ groups, children, location, params }: Props) => (
  <Content>
    <NavigationTab title="Epost">
      <NavigationLink to={'/admin/email/lists'}>Lister</NavigationLink>
      <NavigationLink to={'/admin/email/users'}>Brukere</NavigationLink>
      <NavigationLink to={'/admin/email/restricted'}>
        Begrenset epost
      </NavigationLink>
    </NavigationTab>
    <CreateAction pathname={location.pathname} />
    {children}
  </Content>
);

export default EmailPage;
