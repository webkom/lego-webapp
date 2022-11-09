import { push } from 'connected-react-router';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  createMeeting,
  inviteUsersAndGroups,
} from 'app/actions/MeetingActions';
import { LoginPage } from 'app/components/LoginForm';
import config from 'app/config';
import { EDITOR_EMPTY } from 'app/utils/constants';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import MeetingEditor from './components/MeetingEditor';

const time = (hours, minutes) =>
  moment()
    .tz(config.timezone)
    .startOf('day')
    .add({
      hours,
      minutes,
    })
    .toISOString();

const mapStateToProps = (state, props) => {
  return {
    user: props.currentUser,
    initialValues: {
      startTime: time(17, 15),
      endTime: time(20),
      report: EDITOR_EMPTY,
      useMazemap: true,
    },
  };
};

const mapDispatchToProps = {
  handleSubmitCallback: createMeeting,
  inviteUsersAndGroups,
  push,
};
export default compose(
  replaceUnlessLoggedIn(LoginPage),
  connect(mapStateToProps, mapDispatchToProps)
)(MeetingEditor);
