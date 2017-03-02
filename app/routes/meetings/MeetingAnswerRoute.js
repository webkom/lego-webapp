import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { answerMeetingInvitation } from 'app/actions/MeetingActions';
import LoadingIndicator from 'app/components/LoadingIndicator';

function loadData({ action, token, loggedIn }, props) {
  props.answerMeetingInvitation(action, token, loggedIn);
}

function mapStateToProps(state, props) {
  const { action } = props.params;
  const { token } = props.location.query;
  return {
    action,
    token,
    loggedIn: state.auth.token !== null
  };
}

const mapDispatchToProps = { answerMeetingInvitation };

function WaitingIndicator() {
  return <LoadingIndicator loading />;
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['action', 'token', 'loggedIn'], loadData),
)(WaitingIndicator);
