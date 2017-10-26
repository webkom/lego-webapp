// @flow

import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  fetchMeeting,
  setInvitationStatus,
  deleteMeeting,
  answerMeetingInvitation,
  resetMeetingsToken
} from 'app/actions/MeetingActions';
import MeetingDetailLoginRoute from './MeetingDetailLoginRoute';
import MeetingAnswer from './components/MeetingAnswer';
import prepare from 'app/utils/prepare';

const loadMeeting = ({ loggedIn, params: { meetingId } }, dispatch) =>
  loggedIn ? dispatch(fetchMeeting(meetingId)) : Promise.resolve();

const loadData = (props, dispatch) => {
  const { action, token } = props.location.query;
  const loggedIn = props.loggedIn;

  if (token && action) {
    return dispatch(answerMeetingInvitation(action, token, loggedIn)).then(() =>
      loadMeeting(props, dispatch)
    );
  }

  return loadMeeting(props, dispatch);
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

type Props = {
  loggedIn: boolean,
  meetingsToken: Object,
  router: any,
  resetMeetingsToken: () => void
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
  deleteMeeting,
  resetMeetingsToken
};

export default compose(
  prepare(loadData, ['params.meetingId', 'loggedIn']),
  connect(mapStateToProps, mapDispatchToProps)
)(MeetingComponent);
