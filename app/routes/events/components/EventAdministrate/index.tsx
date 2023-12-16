import loadable from '@loadable/component';
import { LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Switch, Route, useParams, useRouteMatch } from 'react-router-dom';
import { CompatRoute } from 'react-router-dom-v5-compat';
import { fetchAdministrate } from 'app/actions/EventActions';
import { Content } from 'app/components/Content';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import RouteWrapper from 'app/components/RouteWrapper';
import {
  selectEventById,
  selectMergedPoolWithRegistrations,
  selectPoolsWithRegistrationsForEvent,
} from 'app/reducers/events';
import { useUserContext } from 'app/routes/app/AppRoute';
import { canSeeAllergies } from 'app/routes/events/components/EventAdministrate/Allergies';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';

const EventStatistics = loadable(
  () => import('app/routes/events/EventStatisticsRoute')
);
const Attendees = loadable(() => import('./Attendees'));
const EventAllergiesRoute = loadable(
  () => import('app/routes/events/EventAllergiesRoute')
);
const AdminRegister = loadable(() => import('./AdminRegister'));
const Abacard = loadable(() => import('./Abacard'));

const EventAdministrateIndex = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const event = useAppSelector((state) => selectEventById(state, { eventId }));
  const pools = useAppSelector((state) =>
    event?.isMerged
      ? selectMergedPoolWithRegistrations(state, { eventId })
      : selectPoolsWithRegistrationsForEvent(state, { eventId })
  );
  const actionGrant = useAppSelector((state) => state.events.actionGrant);
  const loading = useAppSelector((state) => state.events.fetching);
  const { currentUser, loggedIn } = useUserContext();

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchAdministrate',
    () => eventId && dispatch(fetchAdministrate(eventId)),
    [eventId]
  );

  const { path } = useRouteMatch();
  const base = `/events/${eventId}/administrate`;

  if (!event || loading) {
    return (
      <Content>
        <LoadingIndicator loading={loading} />
      </Content>
    );
  }

  const props = {
    event,
    pools,
    actionGrant,
    currentUser,
    loggedIn,
  };

  return (
    <Content>
      <NavigationTab
        title={event ? event.title : ''}
        back={{
          label: 'Tilbake',
          path: '/events/' + event.slug,
        }}
      >
        <NavigationLink to={`${base}/attendees`}>Påmeldinger</NavigationLink>
        {event && canSeeAllergies(currentUser, event) && (
          <NavigationLink to={`${base}/allergies`}>Allergier</NavigationLink>
        )}
        <NavigationLink to={`${base}/statistics`}>Statistikk</NavigationLink>
        <NavigationLink to={`${base}/admin-register`}>
          Adminregistrering
        </NavigationLink>
        <NavigationLink to={`${base}/abacard`}>Abacard</NavigationLink>
      </NavigationTab>

      <Switch>
        <Route exact path={`${path}/attendees`} component={Attendees} />
        <RouteWrapper
          exact
          path={`${path}/allergies`}
          Component={EventAllergiesRoute}
          passedProps={{
            currentUser,
            loggedIn,
            ...props,
          }}
        />
        <RouteWrapper
          exact
          path={`${path}/statistics`}
          Component={EventStatistics}
          passedProps={{
            currentUser,
            loggedIn,
            ...props,
          }}
        />
        <Route
          exact
          path={`${path}/admin-register`}
          component={AdminRegister}
        />
        <CompatRoute exact path={`${path}/abacard`} component={Abacard} />
      </Switch>
    </Content>
  );
};

export default guardLogin(EventAdministrateIndex);
