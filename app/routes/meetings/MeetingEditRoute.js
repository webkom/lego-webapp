// @flow
import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';
import { compose } from 'redux';
import MeetingEditor from './components/MeetingEditor';
import { editMeeting, fetchMeeting } from 'app/actions/MeetingActions';
import { formValueSelector } from 'redux-form';
import { selectMeetingById } from 'app/reducers/meetings';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

const mapDispatchToProps = { handleSubmitCallback: editMeeting, fetchMeeting };

const mapStateToProps = (state, props) => {
  const { meetingId } = props.params;
  const meeting = selectMeetingById(state, { meetingId });
  const valueSelector = formValueSelector('meetingEditor');
  return {
    user: props.currentUser,
    meeting,
    initialValues: meeting,
    invitingUsers: valueSelector(state, 'users') || [],
    meetingId
  };
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  dispatched(({ params: { meetingId } }, dispatch) => dispatch(fetchMeeting(meetingId)), {
    componentWillReceiveProps: false
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(MeetingEditor);
