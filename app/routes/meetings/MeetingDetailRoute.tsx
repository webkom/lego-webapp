import qs from 'qs';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  fetchMeeting,
  setInvitationStatus,
  answerMeetingInvitation,
  resetMeetingsToken,
} from 'app/actions/MeetingActions';
import { selectEmojis } from 'app/reducers/emojis';
import { selectMeetingById } from 'app/reducers/meetings';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import MeetingDetailLoginRoute from './MeetingDetailLoginRoute';
import MeetingAnswer from './components/MeetingAnswer';
import type { MeetingsTokenResponse } from 'app/reducers/meetingsToken';
import type { UserContextType } from 'app/routes/app/AppRoute';
import type { AppDispatch } from 'app/store/createStore';
import type { ID } from 'app/store/models';
import type { MeetingInvitationStatus } from 'app/store/models/MeetingInvitation';
import type { PublicUser } from 'app/store/models/User';
import type { RouteChildrenProps } from 'react-router';

type Params = {
  meetingId: string;
};

const loadMeeting = (
  {
    loggedIn,
    match: {
      params: { meetingId },
    },
  },
  dispatch
) =>
  loggedIn
    ? Promise.all([dispatch(fetchMeeting(meetingId))])
    : Promise.resolve();

const loadData = async (
  props: RouteChildrenProps<Params> & UserContextType,
  dispatch: AppDispatch
) => {
  const search = qs.parse(props.location.search, {
    ignoreQueryPrefix: true,
  });
  const { action, token } = search;
  const loggedIn = props.loggedIn;

  if (
    token &&
    action &&
    typeof token === 'string' &&
    typeof action === 'string'
  ) {
    await dispatch(answerMeetingInvitation(action, token, loggedIn));
    return loadMeeting(props, dispatch);
  }

  return loadMeeting(props, dispatch);
};

const mapStateToProps = (state, props) => {
  const {
    match: {
      params: { meetingId },
    },
    currentUser,
  } = props;
  const search = qs.parse(props.location.search, {
    ignoreQueryPrefix: true,
  });
  const { action, token } = search;
  const meetingsToken = state.meetingsToken;
  const meeting = selectMeetingById(state, {
    meetingId,
  });
  const showAnswer = Boolean(
    meetingsToken.response === 'SUCCESS' && action && token
  );
  const emojis = selectEmojis(state);
  return {
    meetingsToken,
    user: props.currentUser,
    showAnswer,
    meeting,
    currentUser,
    emojis,
  };
};

type Props = {
  loggedIn: boolean;
  meetingsToken: {
    user: PublicUser;
    response: MeetingsTokenResponse;
    meeting: ID;
    status: MeetingInvitationStatus;
  };
  resetMeetingsToken: () => void;
};

const MeetingComponent = (props: Props) => {
  const { loggedIn, meetingsToken, resetMeetingsToken } = props;

  if (!loggedIn && meetingsToken.meeting) {
    return (
      <MeetingAnswer
        {...meetingsToken}
        resetMeetingsToken={resetMeetingsToken}
      />
    );
  }

  return <MeetingDetailLoginRoute {...props} />;
};

const mapDispatchToProps = {
  fetchMeeting,
  setInvitationStatus,
  resetMeetingsToken,
};
export default compose(
  withPreparedDispatch('fetchMeetingDetail', loadData, (props) => [
    props.match.params.meetingId,
    props.loggedIn,
  ]),
  connect(mapStateToProps, mapDispatchToProps)
)(MeetingComponent);
