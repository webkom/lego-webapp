// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import UserProfile from './components/UserProfile';
import {
  fetchUser,
  addPenalty,
  deletePenalty,
  changeGrade
} from 'app/actions/UserActions';
import { fetchAllWithType } from 'app/actions/GroupActions';
import { fetchPrevious, fetchUpcoming } from 'app/actions/EventActions';
import { fetchUserFeed } from 'app/actions/FeedActions';
import { selectUserWithGroups } from 'app/reducers/users';
import {
  selectPreviousEvents,
  selectUpcomingEvents
} from 'app/reducers/events';
import { selectGroupsWithType } from 'app/reducers/groups';
import { selectPenaltyByUserId } from 'app/reducers/penalties';
import loadingIndicator from 'app/utils/loadingIndicator';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import prepare from 'app/utils/prepare';
import { LoginPage } from 'app/components/LoginForm';

const loadData = (
  {
    match: {
      params: { username }
    }
  },
  dispatch
) => {
  return dispatch(fetchUser(username)).then(action =>
    Promise.all([
      dispatch(fetchPrevious()),
      dispatch(fetchUpcoming()),
      dispatch(fetchAllWithType('klasse'))
    ])
  );
  // TODO: re-enable when the user feed is fixed:
  // .then(action =>
  //   dispatch(fetchUserFeed(action.payload.result))
  //  );
};

const mapStateToProps = (state, props) => {
  const {
    match: { params }
  } = props;
  const username =
    params.username === 'me' ? state.auth.username : params.username;

  const user = selectUserWithGroups(state, { username });
  let feed;
  let feedItems;
  const previousEvents = selectPreviousEvents(state);
  const upcomingEvents = selectUpcomingEvents(state);
  let penalties;
  if (user) {
    feed = { type: 'user', activities: [] };
    feedItems = [];
    // TODO: re-enable! see above.
    // feed = selectFeedById(state, { feedId: feedIdByUserId(user.id) });
    // feedItems = selectFeedActivitesByFeedId(state, {
    //   feedId: feedIdByUserId(user.id)
    // });
    penalties = selectPenaltyByUserId(state, { userId: user.id });
  }

  const isMe =
    params.username === 'me' || params.username === state.auth.username;
  const actionGrant = (user && user.actionGrant) || [];
  const showSettings = isMe || actionGrant.includes('edit');
  const canChangeGrade = state.allowed.groups;
  const canDeletePenalties = state.allowed.penalties;
  const groups = selectGroupsWithType(state, { groupType: 'klasse' });
  return {
    username,
    auth: state.auth,
    loggedIn: props.loggedIn,
    user,
    previousEvents,
    upcomingEvents,
    feed,
    feedItems,
    showSettings,
    isMe,
    loading: state.events.fetching,
    penalties,
    canDeletePenalties,
    groups,
    canChangeGrade
  };
};

const mapDispatchToProps = {
  fetchUser,
  fetchUpcoming,
  fetchUserFeed,
  addPenalty,
  deletePenalty,
  changeGrade
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(loadData, ['match.params.username']),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  loadingIndicator(['user'])
)(UserProfile);
