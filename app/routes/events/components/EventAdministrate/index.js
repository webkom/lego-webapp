// @flow

import React, { type Element } from 'react';

import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import { Content } from 'app/components/Content';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { LoginPage } from 'app/components/LoginForm';
import type { EventEntity } from 'app/reducers/events';

type Props = {
  children: Array<Element<*>>,
  currentUser: Object,
  isMe: boolean,
  event: ?EventEntity,
  match: {
    params: {
      eventId: string
    }
  }
};

const EventAdministrateIndex = (props: Props) => {
  const base = `/events/${props.match.params.eventId}/administrate`;
  // At the moment changing settings for other users only works
  // for the settings under `/profile` - so no point in showing
  // the other tabs.
  return (
    <Content>
      <NavigationTab title={props.event ? props.event.title : ''}>
        <NavigationLink to={`${base}/attendees`}>Påmeldinger</NavigationLink>
        <NavigationLink to={`${base}/admin-register`}>
          Adminregistrering
        </NavigationLink>
        <NavigationLink to={`${base}/abacard`}>Abacard</NavigationLink>
      </NavigationTab>
      {props.children &&
        props.children.map(child =>
          React.cloneElement(child, {
            ...props,
            children: undefined
          })
        )}
    </Content>
  );
};

export default replaceUnlessLoggedIn(LoginPage)(EventAdministrateIndex);
