// @flow
// import React from 'react';
import { connect } from 'react-redux';
import MeetingEditor from './components/MeetingEditor';
import { createMeeting } from 'app/actions/MeetingActions';

const mapDispatchToProps = { handleSubmitCallback: createMeeting };

export default connect(null, mapDispatchToProps)(MeetingEditor);
