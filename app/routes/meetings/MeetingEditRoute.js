// @flow
import { connect } from 'react-redux';
import { compose } from 'redux';
import MeetingEditor from './components/MeetingEditor';
import { editMeeting, fetchMeeting } from 'app/actions/MeetingActions';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { selectMeetingById } from 'app/reducers/meetings';

const mapDispatchToProps = { handleSubmitCallback: editMeeting, fetchMeeting };

function loadData({ meetingId }, props) {
  props.fetchMeeting(meetingId);
}

function mapStateToProps(state, props) {
  const { meetingId } = props.params;
  const meeting = selectMeetingById(state, { meetingId });
  return {
    meeting,
    initialValues: meeting,
    meetingId
  };
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['meetingId', 'loggedIn'], loadData),
)(MeetingEditor);
