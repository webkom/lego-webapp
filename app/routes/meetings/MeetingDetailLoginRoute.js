import { connect } from 'react-redux';
import { compose } from 'redux';
import { dispatched } from 'react-prepare';
import { fetchMeeting, setInvitationStatus, deleteMeeting } from 'app/actions/MeetingActions';
import { selectMeetingById } from 'app/reducers/meetings';
import MeetingDetail from './components/MeetingDetail';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

const loadData = (props, dispatch) => {
  const { meetingId } = props.params;
  return dispatch(fetchMeeting(meetingId));
};

const mapStateToProps = (state, props) => {
  const { meetingId } = props.params;
  const meeting = selectMeetingById(state, { meetingId });
  return {
    meeting,
    meetingId,
    user: props.currentUser
  };
};

const mapDispatchToProps = {
  fetchMeeting,
  setInvitationStatus,
  deleteMeeting
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  dispatched(loadData, { componentWillReceiveProps: false }),
  connect(mapStateToProps, mapDispatchToProps)
)(MeetingDetail);
