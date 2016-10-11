// import { compose } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'redux';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { fetchMeeting } from 'app/actions/MeetingActions';
import { fetchMeetingInvitations, setInvitationStatus } from 'app/actions/MeetingInvitationActions';
import { selectMeetingById } from 'app/reducers/meetings';
import { selectMeetingInvitations } from 'app/reducers/meetingInvitations';
import MeetingDetail from './components/MeetingDetail';

function loadData({ meetingId }, props) {
  props.fetchMeeting(meetingId);
  props.fetchMeetingInvitations(meetingId);
}

function mapStateToProps(state, props) {
  const { meetingId } = props.params;
  const meeting = selectMeetingById(state, { meetingId });
  const invitations = selectMeetingInvitations(state, { meetingId });
  const userIdMe = state.users.byId[state.auth.username].id;
  return {
    meeting,
    meetingId,
    invitations,
    userIdMe,
  };
}

const mapDispatchToProps = { fetchMeeting, fetchMeetingInvitations, setInvitationStatus };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['meetingId', 'loggedIn'], loadData),
)(MeetingDetail);
