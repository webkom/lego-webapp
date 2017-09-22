// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';
import UserProfile from './components/UserProfile';
import {
  fetchUser,
  followUser,
  unfollowUser,
  fetchUserFollowings
} from 'app/actions/UserActions';
import { fetchUserFeed } from 'app/actions/FeedActions';
import {
  selectFeedById,
  selectFeedActivitesByFeedId,
  feedIdByUserId
} from 'app/reducers/feeds';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { LoginPage } from 'app/components/LoginForm';

const loadData = ({ params: { username }, currentUser }, dispatch) => {
  return dispatch(fetchUser(username)).then(action => {
    dispatch(fetchUserFollowings(currentUser));
    /**
     * /users/me has no username property and the application fetches "me"
     * when that happens. Extract the current username from the fetch response
     * and then lookup the user ID.
     * This hack exists because User is the only entity that doesn't use ID as
     * the lookup field.
     */
    const userId = action.payload.entities.users[action.payload.result].id;
    return dispatch(fetchUserFeed(userId));
  });
};

const mapStateToProps = (state, props) => {
  const username = props.params.username || state.auth.username;
  const user = state.users.byId[username];

  const feed = user
    ? selectFeedById(state, { feedId: feedIdByUserId(user.id) })
    : undefined;
  const feedItems = user
    ? selectFeedActivitesByFeedId(state, {
        feedId: feedIdByUserId(user.id)
      })
    : undefined;

  return {
    username,
    isMe:
      !props.params.username || props.params.username === state.auth.username,
    auth: state.auth,
    loggedIn: props.loggedIn,
    user,
    feed,
    feedItems
  };
};

const mapDispatchToProps = {
  fetchUser,
  fetchUserFeed,
  followUser,
  unfollowUser
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  dispatched(loadData, {
    componentWillReceiveProps: false
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(UserProfile);
