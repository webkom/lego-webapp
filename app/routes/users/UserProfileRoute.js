// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';
import UserProfile from './components/UserProfile';
import { fetchUser } from 'app/actions/UserActions';
import { fetchUserFeed } from 'app/actions/FeedActions';
import {
  selectFeedById,
  selectFeedActivitesByFeedId,
  feedIdByUsername
} from 'app/reducers/feeds';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { LoginPage } from 'app/components/LoginForm';

const loadData = ({ currentUser, params: { username } }, dispatch) => {
  if (username) {
    return dispatch(fetchUser(username)).then(() =>
      dispatch(fetchUserFeed(username))
    );
  }
  return dispatch(fetchUserFeed(currentUser.username));
};

const mapStateToProps = (state, props) => {
  const username = props.params.username || state.auth.username;

  const feed = selectFeedById(state, { feedId: feedIdByUsername(username) });
  const feedItems = selectFeedActivitesByFeedId(state, {
    feedId: feedIdByUsername(username)
  });

  return {
    username,
    isMe:
      !props.params.username || props.params.username === state.auth.username,
    auth: state.auth,
    user: state.users.byId[username],
    loggedIn: state.auth.token !== null,
    feed,
    feedItems
  };
};

const mapDispatchToProps = { fetchUser, fetchUserFeed };

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  dispatched(loadData, {
    componentWillReceiveProps: false
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(UserProfile);
