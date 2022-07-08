// @flow

import { connect } from 'react-redux';
import { compose } from 'redux';

import { fetchPrevious, fetchUpcoming } from 'app/actions/EventActions';
import { fetchAllWithType } from 'app/actions/GroupActions';
import {
  addPenalty,
  changeGrade,
  deletePenalty,
  fetchUser,
} from 'app/actions/UserActions';
import { LoginPage } from 'app/components/LoginForm';
import { GroupTypeGrade } from 'app/models';
import {
  selectPreviousEvents,
  selectUpcomingEvents,
} from 'app/reducers/events';
import { selectGroupsWithType } from 'app/reducers/groups';
import { selectPenaltyByUserId } from 'app/reducers/penalties';
//import { fetchUserFeed } from 'app/actions/FeedActions';
import { selectUserWithGroups } from 'app/reducers/users';
import loadingIndicator from 'app/utils/loadingIndicator';
import prepare from 'app/utils/prepare';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import UserProfile from './components/UserProfile';

const loadData = (
  {
    match: {
      params: { username },
    },
    isMe,
  },
  dispatch
) =>
  Promise.all([
    dispatch(fetchAllWithType(GroupTypeGrade)),
    isMe && dispatch(fetchPrevious()),
    isMe && dispatch(fetchUpcoming()),
    isMe || dispatch(fetchUser(username)),
  ]);
// TODO: re-enable when the user feed is fixed:
// .then(action =>
//   dispatch(fetchUserFeed(action.payload.result))
//  );

const mapStateToProps = (state, props) => {
  const {
    match: { params },
  } = props;
  const username =
    params.username === 'me' ? state.auth.username : params.username;

  const user = selectUserWithGroups(state, { username });
  //let feed;
  //let feedItems;
  const previousEvents = selectPreviousEvents(state);
  const upcomingEvents = selectUpcomingEvents(state);
  let penalties;
  if (user) {
    //  feed = { type: 'user', activities: [] };
    //  feedItems = [];
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
  const showSettings =
    (isMe || actionGrant.includes('edit')) && user && user.username;
  const canChangeGrade = state.allowed.groups;
  const canEditEmailLists = state.allowed.email;
  const canDeletePenalties = state.allowed.penalties;
  const groups = selectGroupsWithType(state, { groupType: 'klasse' });
  return {
    username,
    auth: state.auth,
    loggedIn: props.loggedIn,
    user,
    previousEvents,
    upcomingEvents,
    //feed,
    //feedItems,
    showSettings,
    isMe,
    loading: state.events.fetching,
    penalties,
    canDeletePenalties,
    groups,
    canChangeGrade,
    canEditEmailLists,
  };
};

const mapDispatchToProps = {
  fetchUser,
  fetchUpcoming,
  //fetchUserFeed,
  addPenalty,
  deletePenalty,
  changeGrade,
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  connect(mapStateToProps, mapDispatchToProps),
  prepare(loadData, ['match.params.username']),
  loadingIndicator(['user'])
)(UserProfile);
