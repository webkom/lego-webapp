import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  fetchMeeting,
  setInvitationStatus,
  answerMeetingInvitation,
  resetMeetingsToken,
} from 'app/actions/MeetingActions';
import MeetingDetailLoginRoute from './MeetingDetailLoginRoute';
import MeetingAnswer from './components/MeetingAnswer';
import { selectMeetingById } from 'app/reducers/meetings';
import { deleteComment } from 'app/actions/CommentActions';
import qs from 'qs';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';

const loadMeeting = (
  {
    loggedIn,
    match: {
      params: { meetingId },
    },
  },
  dispatch
) => (loggedIn ? dispatch(fetchMeeting(meetingId)) : Promise.resolve());

const loadData = (props, dispatch): any => {
  const search = qs.parse(props.location.search, {
    ignoreQueryPrefix: true,
  });
  const { action, token } = search;
  const loggedIn = props.loggedIn;

  if (
    token &&
    action &&
    typeof token === 'string' &&
    typeof action === 'string'
  ) {
    return dispatch(answerMeetingInvitation(action, token, loggedIn)).then(() =>
      loadMeeting(props, dispatch)
    );
  }

  return loadMeeting(props, dispatch);
};

const mapStateToProps = (state, props) => {
  const {
    match: {
      params: { meetingId },
    },
    currentUser,
  } = props;
  const search = qs.parse(props.location.search, {
    ignoreQueryPrefix: true,
  });
  const { action, token } = search;
  const meetingsToken = state.meetingsToken;
  const meeting = selectMeetingById(state, {
    meetingId,
  });
  const showAnswer = Boolean(
    meetingsToken.response === 'SUCCESS' && action && token
  );
  return {
    meetingsToken,
    user: props.currentUser,
    showAnswer,
    meeting,
    currentUser,
  };
};

type Props = {
  loggedIn: boolean;
  meetingsToken: Record<string, any>;
  router: any;
  resetMeetingsToken: () => void;
};

const MeetingComponent = (props: Props) => {
  const { loggedIn, meetingsToken, router, resetMeetingsToken } = props;

  if (!loggedIn && meetingsToken.meeting) {
    return (
      <MeetingAnswer
        {...meetingsToken}
        router={router}
        resetMeetingsToken={resetMeetingsToken}
      />
    );
  }

  return <MeetingDetailLoginRoute {...props} />;
};

const mapDispatchToProps = {
  fetchMeeting,
  setInvitationStatus,
  resetMeetingsToken,
  deleteComment,
};
export default compose(
  withPreparedDispatch('fetchMeetingDetail', loadData, (props) => [
    props.match.params.meetingId,
    props.loggedIn,
  ]),
  connect(mapStateToProps, mapDispatchToProps)
)(MeetingComponent);
