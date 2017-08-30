// @flow
import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';
import { compose } from 'redux';
import MeetingEditor from './components/MeetingEditor';
import { editMeeting, fetchMeeting } from 'app/actions/MeetingActions';
import { formValueSelector } from 'redux-form';
import { selectMeetingById } from 'app/reducers/meetings';

const mapDispatchToProps = { handleSubmitCallback: editMeeting, fetchMeeting };

const mapStateToProps = (state, props) => {
  const { meetingId } = props.params;
  const meeting = selectMeetingById(state, { meetingId });
  const valueSelector = formValueSelector('meetingEditor');
  return {
    meeting,
    initialValues: meeting,
    invitingUsers: valueSelector(state, 'users') || [],
    meetingId
  };
};

export default compose(
  dispatched(
    ({ params: { meetingId } }, dispatch) => dispatch(fetchMeeting(meetingId)),
    {
      componentWillReceiveProps: false
    }
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(MeetingEditor);
