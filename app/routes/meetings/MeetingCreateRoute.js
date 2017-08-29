// @flow
import { connect } from 'react-redux';
import MeetingEditor from './components/MeetingEditor';
import { createMeeting } from 'app/actions/MeetingActions';

import { formValueSelector } from 'redux-form';
import moment from 'moment';

const mapDispatchToProps = { handleSubmitCallback: createMeeting };

const time = (hours, minutes) =>
  moment().startOf('day').add({ hours, minutes }).toISOString();

function mapStateToProps(state, props) {
  const valueSelector = formValueSelector('meetingEditor');
  return {
    initialValues: {
      startTime: time(17, 15),
      endTime: time(20),
      report: '<p></p>'
    },
    invitingUsers: valueSelector(state, 'users') || []
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MeetingEditor);
