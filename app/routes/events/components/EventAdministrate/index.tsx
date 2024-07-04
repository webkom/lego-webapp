import loadable from '@loadable/component';
import { Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import { Outlet, type RouteObject, useParams } from 'react-router-dom';
import { fetchAdministrate } from 'app/actions/EventActions';
import { NavigationTab } from 'app/components/NavigationTab/NavigationTab';
import Tooltip from 'app/components/Tooltip';
import { useCurrentUser } from 'app/reducers/auth';
import { selectEventById } from 'app/reducers/events';
import { canSeeAllergies } from 'app/routes/events/components/EventAdministrate/Allergies';
import pageNotFound from 'app/routes/pageNotFound';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';

const Statistics = loadable(() => import('./Statistics'));
const Attendees = loadable(() => import('./Attendees'));
const Allergies = loadable(() => import('./Allergies'));
const AdminRegister = loadable(() => import('./AdminRegister'));
const Abacard = loadable(() => import('./Abacard'));

const EventAdministrateIndex = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const event = useAppSelector((state) => selectEventById(state, { eventId }));
  const fetching = useAppSelector((state) => state.events.fetching);
  const currentUser = useCurrentUser();

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchAdministrate',
    () => eventId && dispatch(fetchAdministrate(eventId)),
    [eventId],
  );

  const base = `/events/${eventId}/administrate`;

  return (
    <Page
      title={`Administrerer: ${event.title}`}
      back={
        event?.slug && {
          label: 'Tilbake til arrangement',
          href: '/events/' + event.slug,
        }
      }
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
      <Helmet title={`Administrer: ${event.title}`} />
      <Outlet />
    </Page>
  );
};

const eventAdministrateRoute: RouteObject[] = [
  {
    Component: guardLogin(EventAdministrateIndex),
    children: [
      { path: 'attendees', Component: Attendees },
      { path: 'allergies', Component: Allergies },
      { path: 'statistics', Component: Statistics },
      { path: 'admin-register', Component: AdminRegister },
      { path: 'abacard', Component: Abacard },
    ],
  },
  { path: '*', children: pageNotFound },
];

export default eventAdministrateRoute;
