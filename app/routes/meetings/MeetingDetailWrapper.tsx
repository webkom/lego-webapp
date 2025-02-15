import pkg from '@webkom/react-prepare';
const { usePreparedEffect } = pkg;
import qs from 'qs';
import { useLocation, useParams } from 'react-router';
import {
  fetchMeeting,
  answerMeetingInvitation,
} from 'app/actions/MeetingActions';
import { useIsLoggedIn } from 'app/reducers/auth';
import { MeetingTokenResponse } from 'app/reducers/meetings';
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
  const meetingToken = useAppSelector((state) => state.meetings.meetingToken);
  const loggedIn = useIsLoggedIn();

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

      return loggedIn && meetingId
        ? dispatch(fetchMeeting(meetingId))
        : Promise.resolve();
    },
    [meetingId, loggedIn, token, action],
  );

  if (!loggedIn && meetingToken.response === MeetingTokenResponse.Success) {
    return <MeetingAnswer {...meetingToken} />;
  }

  return <MeetingDetail />;
};

export default MeetingDetailWrapper;
