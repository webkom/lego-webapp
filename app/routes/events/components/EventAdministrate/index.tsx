import { Content } from 'app/components/Content';
import { LoginPage } from 'app/components/LoginForm';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import { canSeeAllergies } from 'app/routes/events/components/EventAdministrate/Allergies';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import type { ID } from 'app/store/models';
import type { AdministrateEvent } from 'app/store/models/Event';

import type { CurrentUser } from 'app/store/models/User';
import type { ReactNode } from 'react';

type Props = {
  children: (props: Props) => ReactNode;
  currentUser: CurrentUser;
  isMe: boolean;
  event?: AdministrateEvent;
  match: {
    params: {
      eventId: string;
    };
  };
  pools: Array<ID>;
};

const EventAdministrateIndex = (props: Props) => {
  const base = `/events/${props.match.params.eventId}/administrate`;
  // At the moment changing settings for other users only works
  // for the settings under `/profile` - so no point in showing
  // the other tabs.

  return (
    <Content>
      <NavigationTab
        title={props.event ? props.event.title : ''}
        back={{
          label: 'Tilbake',
          path: '/events/' + props.event?.slug,
        }}
      >
        <NavigationLink to={`${base}/attendees`}>Påmeldinger</NavigationLink>
        {props.event && canSeeAllergies(props.currentUser, props.event) && (
          <NavigationLink to={`${base}/allergies`}>Allergier</NavigationLink>
        )}
        <NavigationLink to={`${base}/statistics`}>Statistikk</NavigationLink>
        <NavigationLink to={`${base}/admin-register`}>
          Adminregistrering
        </NavigationLink>
        <NavigationLink to={`${base}/abacard`}>Abacard</NavigationLink>
      </NavigationTab>
      {props.children(props)}
    </Content>
  );
};

export default replaceUnlessLoggedIn(LoginPage)(EventAdministrateIndex);
