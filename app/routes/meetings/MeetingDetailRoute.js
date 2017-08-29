import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { dispatched } from 'react-prepare';
import {
  fetchMeeting,
  setInvitationStatus,
  deleteMeeting,
  answerMeetingInvitation
} from 'app/actions/MeetingActions';
import { selectMeetingById } from 'app/reducers/meetings';
import MeetingDetail from './components/MeetingDetail';
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
  return dispatch(fetchMeeting(meetingId));
};

const mapStateToProps = (state, props) => {
  const { meetingId } = props.params;
  const { action, token } = props.location.query;
  const showAnswer = Boolean(action && token);
  const meeting = selectMeetingById(state, { meetingId });
  const meetingsToken = state.meetingsToken;
  const userMe = state.auth.username
    ? state.users.byId[state.auth.username]
    : {};
  return {
    meeting,
    meetingsToken,
    meetingId,
    userMe,
    showAnswer
  };
};

const MeetingComponent = props => {
  const { loggedIn, meetingsToken } = props;
  if (!loggedIn) {
    return <MeetingAnswer {...meetingsToken} />;
  }
  return <MeetingDetail {...props} />;
};

const mapDispatchToProps = { fetchMeeting, setInvitationStatus, deleteMeeting };

export default compose(
  dispatched(loadData, {
    componentWillReceiveProps: false
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(MeetingComponent);
