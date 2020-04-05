import { connect } from 'react-redux';
import { compose } from 'redux';
import { push } from 'connected-react-router';
import {
  fetchMeeting,
  setInvitationStatus,
  deleteMeeting
} from 'app/actions/MeetingActions';
import { selectMeetingById } from 'app/reducers/meetings';
import {
  selectMeetingInvitationsForMeeting,
  selectMeetingInvitation
} from 'app/reducers/meetingInvitations';
import { selectUserById } from 'app/reducers/users';
import MeetingDetail from './components/MeetingDetail';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { selectCommentsForMeeting } from 'app/reducers/meetings';

const mapDispatchToProps = {
  setInvitationStatus,
  deleteMeeting,
  fetchMeeting,
  push
};

const mapStateToProps = (state, props) => {
  const { meetingId } = props.match.params;
  const { currentUser } = props;
  const meeting = selectMeetingById(state, { meetingId });
  const comments = selectCommentsForMeeting(state, { meetingId });

  if (!meeting) return { currentUser, meetingId };

  const reportAuthor = selectUserById(state, { userId: meeting.reportAuthor });
  const createdBy = selectUserById(state, { userId: meeting.createdBy });
  const meetingInvitations = selectMeetingInvitationsForMeeting(state, {
    meetingId
  });
  const currentUserInvitation = selectMeetingInvitation(state, {
    userId: currentUser.username,
    meetingId
  });
  return {
    meeting,
    meetingId,
    reportAuthor,
    createdBy,
    meetingInvitations,
    currentUserInvitation,
    currentUser,
    comments
  };
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(MeetingDetail);
