import { connect } from 'react-redux';
import { compose } from 'redux';
import { push } from 'redux-first-history';
import { fetchMeeting, setInvitationStatus } from 'app/actions/MeetingActions';
import {
  selectMeetingInvitationsForMeeting,
  selectMeetingInvitation,
} from 'app/reducers/meetingInvitations';
import {
  selectMeetingById,
  selectCommentsForMeeting,
} from 'app/reducers/meetings';
import { selectUserById } from 'app/reducers/users';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import MeetingDetail from './components/MeetingDetail';
import type { UserContextType } from 'app/routes/app/AppRoute';
import type { RootState } from 'app/store/createRootReducer';
import type { RouteChildrenProps } from 'react-router';

type Params = {
  meetingId: string;
};

const mapDispatchToProps = {
  setInvitationStatus,
  fetchMeeting,
  push,
};

const mapStateToProps = (
  state: RootState,
  props: RouteChildrenProps<Params> & UserContextType
) => {
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
  guardLogin,
  connect(mapStateToProps, mapDispatchToProps)
)(MeetingDetail);
