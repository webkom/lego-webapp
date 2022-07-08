// @flow

import type { Element } from 'react';
import { cloneElement } from 'react';

import { Content } from 'app/components/Content';
import { LoginPage } from 'app/components/LoginForm';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import type { EventPool } from 'app/models';
import type { EventEntity } from 'app/reducers/events';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

type Props = {
  children: Array<Element<*>>,
  currentUser: Object,
  isMe: boolean,
  event: ?EventEntity,
  match: {
    params: {
      eventId: string,
    },
  },
  pools: Array<EventPool>,
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
        props.children.map((child) =>
          cloneElement(child, {
            ...props,
            children: undefined,
          })
        )}
    </Content>
  );
};

export default replaceUnlessLoggedIn(LoginPage)(EventAdministrateIndex);
