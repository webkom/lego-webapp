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
  return dispatch(fetchUser(username)).then(action =>
    dispatch(fetchUserFeed(action.payload.result))
  );
};

const mapStateToProps = (state, props) => {
  const { params } = props;
  const username =
    params.username === 'me' ? state.auth.username : params.username;

  const user = selectUserWithGroups(state, { username });

  const feed = selectFeedById(state, { feedId: feedIdByUserId(user.id) });
  const feedItems = selectFeedActivitesByFeedId(state, {
    feedId: feedIdByUserId(user.id)
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
