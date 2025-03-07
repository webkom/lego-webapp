import { usePreparedEffect } from '@webkom/react-prepare';
import { usePageContext } from 'vike-react/usePageContext';
import {
  fetchMeeting,
  answerMeetingInvitation,
} from '~/redux/actions/MeetingActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { useIsLoggedIn } from '~/redux/slices/auth';
import { MeetingTokenResponse } from '~/redux/slices/meetings';
import { useParams } from '~/utils/useParams';
import MeetingAnswer from './MeetingAnswer';
import MeetingDetail from './MeetingDetail';

type Params = {
  meetingId: string;
};

const MeetingDetailWrapper = () => {
  const pageContext = usePageContext();
  const { action, token } = pageContext.urlParsed.search;

  const { meetingId } = useParams<Params>();
  const meetingToken = useAppSelector((state) => state.meetings.meetingToken);
  const loggedIn = useIsLoggedIn();

  const dispatch = useAppDispatch();

  usePreparedEffect(
    `answerMeetingInvitation`,
    () => {
      if (token && action) {
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
