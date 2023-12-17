import loadable from '@loadable/component';
import { LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Switch, Route, useParams, useRouteMatch } from 'react-router-dom';
import { CompatRoute } from 'react-router-dom-v5-compat';
import { fetchAdministrate } from 'app/actions/EventActions';
import { Content } from 'app/components/Content';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import { selectEventById } from 'app/reducers/events';
import { useUserContext } from 'app/routes/app/AppRoute';
import { canSeeAllergies } from 'app/routes/events/components/EventAdministrate/Allergies';
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
  const { currentUser } = useUserContext();

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchAdministrate',
    () => eventId && dispatch(fetchAdministrate(eventId)),
    [eventId]
  );

  const { path } = useRouteMatch();
  const base = `/events/${eventId}/administrate`;

  if (!event) {
    return (
      <Content>
        <LoadingIndicator loading={fetching} />
      </Content>
    );
  }

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
        <Route exact path={`${path}/allergies`} component={Allergies} />
        <Route exact path={`${path}/statistics`} component={Statistics} />
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
