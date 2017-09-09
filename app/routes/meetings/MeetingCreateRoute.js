// @flow
import { compose } from 'redux';
import { connect } from 'react-redux';
import MeetingEditor from './components/MeetingEditor';
import { createMeeting } from 'app/actions/MeetingActions';
import { formValueSelector } from 'redux-form';
import moment from 'moment';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

const time = (hours, minutes) =>
  moment().startOf('day').add({ hours, minutes }).toISOString();

const mapStateToProps = state => {
  const valueSelector = formValueSelector('meetingEditor');
  return {
    initialValues: {
      startTime: time(17, 15),
      endTime: time(20),
      report: '<p></p>'
    },
    invitingUsers: valueSelector(state, 'users') || []
  };
};

const mapDispatchToProps = { handleSubmitCallback: createMeeting };

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  connect(mapStateToProps, mapDispatchToProps)
)(MeetingEditor);
