import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { fetchMeeting, setInvitationStatus } from 'app/actions/MeetingActions';
import { LoginPage } from 'app/components/LoginForm';
import {
  selectMeetingInvitationsForMeeting,
  selectMeetingInvitation,
} from 'app/reducers/meetingInvitations';
import {
  selectMeetingById,
  selectCommentsForMeeting,
} from 'app/reducers/meetings';
import { selectUserById } from 'app/reducers/users';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import MeetingDetail from './components/MeetingDetail';

const mapDispatchToProps = {
  setInvitationStatus,
  fetchMeeting,
  push,
};

const mapStateToProps = (state, props) => {
  const { meetingId } = props.match.params;
  const { currentUser } = props;
  const meeting = selectMeetingById(state, {
    meetingId,
  });
  const comments = selectCommentsForMeeting(state, {
    meetingId,
  });
  if (!meeting)
    return {
      currentUser,
      meetingId,
    };
  const reportAuthor = selectUserById(state, {
    userId: meeting.reportAuthor,
  });
  const createdBy = selectUserById(state, {
    userId: meeting.createdBy,
  });
  const meetingInvitations = selectMeetingInvitationsForMeeting(state, {
    meetingId,
  });
  const currentUserInvitation = selectMeetingInvitation(state, {
    userId: currentUser.username,
    meetingId,
  });
  return {
    meeting,
    meetingId,
    reportAuthor,
    createdBy,
    meetingInvitations,
    currentUserInvitation,
    currentUser,
    comments,
  };
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  connect(mapStateToProps, mapDispatchToProps)
)(MeetingDetail);
