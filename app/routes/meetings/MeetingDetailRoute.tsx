import qs from 'qs';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { deleteComment } from 'app/actions/CommentActions';
import { fetchEmojis } from 'app/actions/EmojiActions';
import {
  fetchMeeting,
  setInvitationStatus,
  answerMeetingInvitation,
  resetMeetingsToken,
} from 'app/actions/MeetingActions';
import { addReaction, deleteReaction } from 'app/actions/ReactionActions';
import type { User } from 'app/models';
import { selectEmojis } from 'app/reducers/emojis';
import { selectMeetingById } from 'app/reducers/meetings';
import type { ReactionsGrouped } from 'app/store/models/Reaction';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import MeetingDetailLoginRoute from './MeetingDetailLoginRoute';
import MeetingAnswer from './components/MeetingAnswer';

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
    ? Promise.all([dispatch(fetchMeeting(meetingId), dispatch(fetchEmojis()))])
    : Promise.resolve();

const loadData = (props, dispatch): any => {
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
    return dispatch(answerMeetingInvitation(action, token, loggedIn)).then(() =>
      loadMeeting(props, dispatch)
    );
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
    fetchingEmojis: state.emojis.fetching,
  };
};

type Props = {
  loggedIn: boolean;
  meetingsToken: {
    status: number;
    user: User;
    response: string;
    meeting: number;
    reactionsGrouped: ReactionsGrouped[];
  };
  router: any;
  resetMeetingsToken: () => void;
};

const MeetingComponent = (props: Props) => {
  const { loggedIn, meetingsToken, router, resetMeetingsToken } = props;

  if (!loggedIn && meetingsToken.meeting) {
    return (
      <MeetingAnswer
        {...meetingsToken}
        router={router}
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
  deleteComment,
  fetchEmojis,
  addReaction,
  deleteReaction,
};
export default compose(
  withPreparedDispatch('fetchMeetingDetail', loadData, (props) => [
    props.match.params.meetingId,
    props.loggedIn,
  ]),
  connect(mapStateToProps, mapDispatchToProps)
)(MeetingComponent);
