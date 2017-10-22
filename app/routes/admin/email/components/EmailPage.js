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

const EmailPage = ({ groups, children, location, params }: Props) => {
  let createAction;
  switch (location.pathname) {
    case '/admin/email/lists':
      createAction = (
        <Link to={'/admin/email/lists/new'} style={{ float: 'right' }}>
          Ny epostliste
        </Link>
      );
      break;
    case '/admin/email/users':
      createAction = (
        <Link to={'/admin/email/users/new'} style={{ float: 'right' }}>
          Ny bruker
        </Link>
      );
      break;
    case '/admin/email/restricted':
      createAction = (
        <Link to={'/admin/email/restricted/new'} style={{ float: 'right' }}>
          Ny begrenset epost
        </Link>
      );
      break;
    default:
  }
  return (
    <Content>
      <NavigationTab title="Epost">
        <NavigationLink to={'/admin/email/lists'}>Lister</NavigationLink>
        <NavigationLink to={'/admin/email/users'}>Brukere</NavigationLink>
        <NavigationLink to={'/admin/email/restricted'}>
          Begrenset epost
        </NavigationLink>
      </NavigationTab>
      {createAction}
      {children}
    </Content>
  );
};

export default EmailPage;
