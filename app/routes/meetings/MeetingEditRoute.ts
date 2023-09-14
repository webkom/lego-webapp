import { connect } from 'react-redux';
import { compose } from 'redux';
import { push } from 'redux-first-history';
import {
  editMeeting,
  fetchMeeting,
  inviteUsersAndGroups,
  deleteMeeting,
} from 'app/actions/MeetingActions';
import { LoginPage } from 'app/components/LoginForm';
import { selectMeetingInvitationsForMeeting } from 'app/reducers/meetingInvitations';
import { selectMeetingById } from 'app/reducers/meetings';
import { selectUserById } from 'app/reducers/users';
import type { UserContextType } from 'app/routes/app/AppRoute';
import type { RootState } from 'app/store/createRootReducer';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import MeetingEditor from './components/MeetingEditor';
import type { RouteChildrenProps } from 'react-router';

type Params = {
  meetingId: string;
};

const mapStateToProps = (
  state: RootState,
  props: RouteChildrenProps<Params> & UserContextType
) => {
  const { meetingId } = props.match.params;
  const meeting = selectMeetingById(state, {
    meetingId,
  });
  if (!meeting)
    return {
      meetingId,
    };
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
  withPreparedDispatch(
    'fetchMeetingEdit',
    (props: RouteChildrenProps<Params>, dispatch) =>
      dispatch(fetchMeeting(props.match.params.meetingId))
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(MeetingEditor);
