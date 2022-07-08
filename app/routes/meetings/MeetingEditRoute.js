// @flow
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose } from 'redux';

import {
  deleteMeeting,
  editMeeting,
  fetchMeeting,
  inviteUsersAndGroups,
} from 'app/actions/MeetingActions';
import { LoginPage } from 'app/components/LoginForm';
import { selectMeetingInvitationsForMeeting } from 'app/reducers/meetingInvitations';
import { selectMeetingById } from 'app/reducers/meetings';
import { selectUserById } from 'app/reducers/users';
import prepare from 'app/utils/prepare';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import MeetingEditor from './components/MeetingEditor';

const mapStateToProps = (state, props) => {
  const { meetingId } = props.match.params;
  const meeting = selectMeetingById(state, { meetingId });
  if (!meeting) return { meetingId };
  const meetingInvitations = selectMeetingInvitationsForMeeting(state, {
    meetingId,
  });
  const reportAuthor = selectUserById(state, {
    userId: meeting.reportAuthor,
  });
  return {
    user: props.currentUser,
    initialValues: {
      ...meeting,
      reportAuthor: reportAuthor && {
        id: reportAuthor.id,
        value: reportAuthor.username,
        label: reportAuthor.fullName,
      },
      report: meeting.report,
      description: meeting.description ?? '',
      mazemapPoi: meeting.mazemapPoi && {
        label: meeting.location,
        value: meeting.mazemapPoi,
      },
      useMazemap: meeting.mazemapPoi > 0,
    },
    meeting,
    meetingId,
    meetingInvitations,
  };
};

const mapDispatchToProps = {
  handleSubmitCallback: editMeeting,
  inviteUsersAndGroups,
  deleteMeeting,
  push,
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(
    (
      {
        match: {
          params: { meetingId },
        },
      },
      dispatch
    ) => dispatch(fetchMeeting(meetingId))
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(MeetingEditor);
