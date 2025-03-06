import { Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { PropsWithChildren } from 'react';
import { Helmet } from 'react-helmet-async';
import { NavigationTab } from '~/components/NavigationTab/NavigationTab';
import Tooltip from '~/components/Tooltip';
import { canSeeAllergies } from '~/pages/(migrated)/events/@eventId/administrate/allergies/+Page';
import { fetchAdministrate } from '~/redux/actions/EventActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { useCurrentUser } from '~/redux/slices/auth';
import { selectEventById } from '~/redux/slices/events';
import { guardLogin } from '~/utils/replaceUnlessLoggedIn';
import { useParams } from '~/utils/useParams';
import type { AdministrateEvent } from '~/redux/models/Event';

const EventAdministrateIndex = ({ children }: PropsWithChildren) => {
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
      {children}
    </Page>
  );
};

export default guardLogin(EventAdministrateIndex);
