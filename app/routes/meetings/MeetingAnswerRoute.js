// import { compose } from 'redux';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { answerMeetingInvitation } from 'app/actions/MeetingActions';
import LoadingIndicator from 'app/components/LoadingIndicator';

function loadData({ action, token }, props) {
  props.answerMeetingInvitation(action, token);
}

function mapStateToProps(state, props) {
  const { action } = props.params;
  const { token } = props.location.query;
  return {
    action,
    token
  };
}

const mapDispatchToProps = { answerMeetingInvitation };

function returnWait() {
  return <LoadingIndicator loading />;
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['action', 'token'], loadData),
)(returnWait);
