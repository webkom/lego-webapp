import { usePreparedEffect } from '@webkom/react-prepare';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import AbaScanner from '~/components/AbaScanner';
import {
  fetchAdministrate,
  markUsernamePresent,
} from '~/redux/actions/EventActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { Presence } from '~/redux/models/Registration';
import {
  selectEventById,
  selectRegistrationGroups,
} from '~/redux/slices/events';
import { guardLogin } from '~/utils/replaceUnlessLoggedIn';
import { useParams } from '~/utils/useParams';

const AbaScannerPage = () => {
  const { eventId } = useParams<{ eventId: string }>() as { eventId: string };
  const event = useAppSelector((state) => selectEventById(state, eventId));
  const { registered } = useAppSelector((state) =>
    selectRegistrationGroups(state, {
      eventId,
    }),
  );
  const isSocketConnected = useAppSelector(
    (state) => state.websockets.connected,
  );
  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchAdministrate',
    () => dispatch(fetchAdministrate(eventId)),
    [eventId],
  );

  useEffect(() => {
    if (isSocketConnected) {
      dispatch(fetchAdministrate(eventId));
    }
  }, [dispatch, eventId, isSocketConnected]);

  const attendees = registered.filter((reg) => reg.pool);
  const presentCount = attendees.filter(
    (reg) => reg.presence === Presence.PRESENT,
  ).length;

  const handleSelect = ({ username }: { username: string }) =>
    dispatch(markUsernamePresent(eventId, username));

  return (
    <>
      <Helmet title="AbaScanner" />
      <AbaScanner
        handleSelect={handleSelect}
        eventHref={`/events/${event?.slug ?? eventId}`}
        presentCount={presentCount}
        attendeeCount={attendees.length}
      />
    </>
  );
};

export default guardLogin(AbaScannerPage);
