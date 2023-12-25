import { usePreparedEffect } from '@webkom/react-prepare';
import qs from 'qs';
import { useLocation, useParams } from 'react-router-dom';
import {
  fetchMeeting,
  answerMeetingInvitation,
} from 'app/actions/MeetingActions';
import { useUserContext } from 'app/routes/app/AppRoute';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import MeetingAnswer from './components/MeetingAnswer';
import MeetingDetail from './components/MeetingDetail';

type Params = {
  meetingId: string;
};

const MeetingDetailWrapper = () => {
  const location = useLocation();
  const { action, token } = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  const { meetingId } = useParams<Params>();
  const meetingsToken = useAppSelector((state) => state.meetingsToken);
  const { loggedIn } = useUserContext();

  const dispatch = useAppDispatch();

  usePreparedEffect(
    `answerMeetingInvitation`,
    () => {
      if (
        token &&
        action &&
        typeof token === 'string' &&
        typeof action === 'string'
      ) {
        dispatch(answerMeetingInvitation(action, token));
      }

      return loggedIn ? dispatch(fetchMeeting(meetingId)) : Promise.resolve();
    },
    [meetingId, loggedIn, token, action]
  );

  if (!loggedIn && meetingsToken.meeting) {
    return <MeetingAnswer {...meetingsToken} />;
  }

  return <MeetingDetail />;
};

export default MeetingDetailWrapper;
