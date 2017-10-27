// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import UserProfile from './components/UserProfile';
import { fetchUser } from 'app/actions/UserActions';
import { fetchUserFeed } from 'app/actions/FeedActions';
import {
  selectFeedById,
  selectFeedActivitesByFeedId,
  feedIdByUserId
} from 'app/reducers/feeds';
import { selectUserWithGroups } from 'app/reducers/users';
import loadingIndicator from 'app/utils/loadingIndicator';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import prepare from 'app/utils/prepare';
import { LoginPage } from 'app/components/LoginForm';

const loadData = ({ params: { username } }, dispatch) => {
  return dispatch(fetchUser(username)).then(action => {
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
  const { params } = props;
  const username =
    params.username === 'me' ? state.auth.username : params.username;

  const user = selectUserWithGroups(state, { username });

  const feed = selectFeedById(state, { feedId: feedIdByUserId(state.auth.id) });
  const feedItems = selectFeedActivitesByFeedId(state, {
    feedId: feedIdByUserId(state.auth.id)
  });

  const isMe =
    params.username === 'me' || params.username === state.auth.username;
  const actionGrant = (user && user.actionGrant) || [];
  const showSettings = isMe || actionGrant.includes('edit');
  return {
    username,
    auth: state.auth,
    loggedIn: props.loggedIn,
    user,
    feed,
    feedItems,
    showSettings,
    isMe
  };
};

const mapDispatchToProps = { fetchUser, fetchUserFeed };

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(loadData, ['params.username']),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['user'])
)(UserProfile);
