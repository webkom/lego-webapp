// @flow
import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import { push } from 'connected-react-router';
import { compose } from 'redux';
import MeetingEditor from './components/MeetingEditor';
import {
  editMeeting,
  fetchMeeting,
  inviteUsersAndGroups,
  deleteMeeting,
} from 'app/actions/MeetingActions';
import { formValueSelector } from 'redux-form';
import { selectMeetingById } from 'app/reducers/meetings';
import { selectUserById } from 'app/reducers/users';
import { selectMeetingInvitationsForMeeting } from 'app/reducers/meetingInvitations';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

const mapDispatchToProps = {
  handleSubmitCallback: editMeeting,
  fetchMeeting,
  inviteUsersAndGroups,
  push,
  deleteMeeting,
};

const mapStateToProps = (state, props) => {
  const { meetingId } = props.match.params;
  const meeting = selectMeetingById(state, { meetingId });
  if (!meeting) return { meetingId };

  const valueSelector = formValueSelector('meetingEditor');
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
      report: meeting ? meeting.report : '',
      description: meeting ? meeting.description : '',
      mazemapPoi: meeting.mazemapPoi && {
        label: meeting.location,
        value: meeting.mazemapPoi,
      },
      useMazemap: meeting.mazemapPoi > 0,
    },
    invitingUsers: valueSelector(state, 'users') || [],
    meeting: {
      ...meeting,
      useMazemap: valueSelector(state, 'useMazemap'),
      mazemapPoi: valueSelector(state, 'mazemapPoi'),
    },
    meetingId,
    meetingInvitations,
  };
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
