import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { push } from 'redux-first-history';
import {
  createMeeting,
  inviteUsersAndGroups,
} from 'app/actions/MeetingActions';
import config from 'app/config';
import { EDITOR_EMPTY } from 'app/utils/constants';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import MeetingEditor from './components/MeetingEditor';

const time = (hours: number, minutes?: number) =>
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
      startTime: time(16, 15),
      endTime: time(18),
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
  guardLogin,
  connect(mapStateToProps, mapDispatchToProps)
)(MeetingEditor);
