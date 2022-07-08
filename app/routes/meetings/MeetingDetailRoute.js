// @flow

import { connect } from 'react-redux';
import qs from 'qs';
import { compose } from 'redux';

import { deleteComment } from 'app/actions/CommentActions';
import {
  answerMeetingInvitation,
  fetchMeeting,
  resetMeetingsToken,
  setInvitationStatus,
} from 'app/actions/MeetingActions';
import { selectMeetingById } from 'app/reducers/meetings';
import prepare from 'app/utils/prepare';
import MeetingAnswer from './components/MeetingAnswer';
import MeetingDetailLoginRoute from './MeetingDetailLoginRoute';

const loadMeeting = (
  {
    loggedIn,
    match: {
      params: { meetingId },
    },
  },
  dispatch
) => (loggedIn ? dispatch(fetchMeeting(meetingId)) : Promise.resolve());

const loadData = (props, dispatch) => {
  const search = qs.parse(props.location.search, { ignoreQueryPrefix: true });
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
  const search = qs.parse(props.location.search, { ignoreQueryPrefix: true });
  const { action, token } = search;
  const meetingsToken = state.meetingsToken;
  const meeting = selectMeetingById(state, { meetingId });
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
  loggedIn: boolean,
  meetingsToken: Object,
  router: any,
  resetMeetingsToken: () => void,
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
  prepare(loadData, ['match.params.meetingId', 'loggedIn']),
  connect(mapStateToProps, mapDispatchToProps)
)(MeetingComponent);
