import loadable from '@loadable/component';
import { LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Route, Routes, useParams } from 'react-router-dom';
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

      <Routes>
        <Route path="attendees" element={<Attendees />} />
        <Route path="allergies" element={<Allergies />} />
        <Route path="statistics" element={<Statistics />} />
        <Route path="admin-register" element={<AdminRegister />} />
        <Route path="abacard" element={<Abacard />} />
      </Routes>
    </Content>
  );
};

export default guardLogin(EventAdministrateIndex);
