// @flow
import { compose } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import MeetingEditor from './components/MeetingEditor';
import {
  createMeeting,
  inviteUsersAndGroups,
} from 'app/actions/MeetingActions';
import moment from 'moment-timezone';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { EDITOR_EMPTY } from 'app/utils/constants';
import config from 'app/config';

const time = (hours, minutes) =>
  moment()
    .tz(config.timezone)
    .startOf('day')
    .add({ hours, minutes })
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
