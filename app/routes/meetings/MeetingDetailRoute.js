import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { dispatched } from '@webkom/react-prepare';
import {
  fetchMeeting,
  setInvitationStatus,
  deleteMeeting,
  answerMeetingInvitation,
  resetMeetingsToken
} from 'app/actions/MeetingActions';
import MeetingDetailLoginRoute from './MeetingDetailLoginRoute';
import MeetingAnswer from './components/MeetingAnswer';

const loadData = (props, dispatch) => {
  const { meetingId } = props.params;
  const { action, token } = props.location.query;
  const loggedIn = props.loggedIn;
  if (!loggedIn && token) {
    return dispatch(answerMeetingInvitation(action, token, loggedIn));
  }
  if (action && token) {
    return dispatch(answerMeetingInvitation(action, token, loggedIn)).then(() =>
      dispatch(fetchMeeting(meetingId))
    );
  }
};

const mapStateToProps = (state, props) => {
  const { action, token } = props.location.query;
  const meetingsToken = state.meetingsToken;
  const showAnswer = Boolean(
    meetingsToken.response === 'SUCCESS' && action && token
  );
  return {
    meetingsToken,
    user: props.currentUser,
    showAnswer
  };
};

const MeetingComponent = props => {
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
  deleteMeeting,
  resetMeetingsToken
};

export default compose(
  dispatched(loadData, { componentWillReceiveProps: false }),
  connect(mapStateToProps, mapDispatchToProps)
)(MeetingComponent);
