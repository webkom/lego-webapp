// import { compose } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'redux';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { fetchMeeting, setInvitationStatus } from 'app/actions/MeetingActions';
import { selectMeetingById } from 'app/reducers/meetings';
import MeetingDetail from './components/MeetingDetail';

function loadData({ meetingId }, props) {
  props.fetchMeeting(meetingId);
}

function mapStateToProps(state, props) {
  const { meetingId } = props.params;
  const meeting = selectMeetingById(state, { meetingId });
  const userMe = state.auth.username ? state.users.byId[state.auth.username] : {};
  return {
    meeting,
    meetingId,
    userMe
  };
}

const mapDispatchToProps = { fetchMeeting, setInvitationStatus };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['meetingId', 'loggedIn'], loadData),
)(MeetingDetail);
