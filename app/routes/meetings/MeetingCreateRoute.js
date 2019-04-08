// @flow
import { compose } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import MeetingEditor from './components/MeetingEditor';
import {
  createMeeting,
  inviteUsersAndGroups
} from 'app/actions/MeetingActions';
import { formValueSelector } from 'redux-form';
import moment from 'moment-timezone';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

const time = (hours, minutes) =>
  moment()
    .startOf('day')
    .add({ hours, minutes })
    .toISOString();

const mapStateToProps = (state, props) => {
  const valueSelector = formValueSelector('meetingEditor');
  return {
    initialValues: {
      startTime: time(17, 15),
      endTime: time(20),
      report: ''
    },
    user: props.currentUser,
    invitingUsers: valueSelector(state, 'users') || []
  };
};

const mapDispatchToProps = {
  handleSubmitCallback: createMeeting,
  inviteUsersAndGroups,
  push
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(MeetingEditor);
