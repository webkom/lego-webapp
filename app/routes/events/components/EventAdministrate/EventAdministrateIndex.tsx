import { Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import { Outlet, useParams } from 'react-router';
import { fetchAdministrate } from 'app/actions/EventActions';
import { NavigationTab } from 'app/components/NavigationTab/NavigationTab';
import Tooltip from 'app/components/Tooltip';
import { useCurrentUser } from 'app/reducers/auth';
import { selectEventById } from 'app/reducers/events';
import { canSeeAllergies } from 'app/routes/events/components/EventAdministrate/Allergies';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import type { AdministrateEvent } from 'app/store/models/Event';

const EventAdministrateIndex = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const event = useAppSelector((state) =>
    eventId ? selectEventById<AdministrateEvent>(state, eventId) : undefined,
  );
  const fetching = useAppSelector((state) => state.events.fetching);
  const currentUser = useCurrentUser();

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchAdministrate',
    () => eventId && dispatch(fetchAdministrate(eventId)),
    [eventId],
  );

  const base = `/events/${eventId}/administrate`;

  const title = event?.title ? `Administrerer: ${event.title}` : 'Administrer';

  return (
    <Page
      title={title}
      back={{
        label: 'Tilbake til arrangement',
        href: '/events/' + (event?.slug ?? eventId),
      }}
      tabs={
        <>
          <NavigationTab href={`${base}/attendees`}>Påmeldinger</NavigationTab>
          <Tooltip
            disabled={canSeeAllergies(currentUser, event)}
            content="Kun ansvarlig gruppe og personen som opprettet arrangementet kan se allergier"
          >
            <NavigationTab
              href={`${base}/allergies`}
              disabled={!canSeeAllergies(currentUser, event)}
            >
              Allergier
            </NavigationTab>
          </Tooltip>
          <NavigationTab href={`${base}/statistics`}>Statistikk</NavigationTab>
          <NavigationTab href={`${base}/admin-register`}>
            Adminregistrering
          </NavigationTab>
          <NavigationTab href={`${base}/abacard`}>Abacard</NavigationTab>
        </>
      }
      skeleton={fetching}
    >
      <Helmet title={title} />
      <Outlet />
    </Page>
  );
};

export default guardLogin(EventAdministrateIndex);
