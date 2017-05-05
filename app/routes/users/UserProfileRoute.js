// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import UserProfile from './components/UserProfile';
import { fetchUser } from 'app/actions/UserActions';
import { fetchUserFeed } from 'app/actions/FeedActions';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import {
  selectFeedById,
  selectFeedActivitesByFeedId,
  feedIdByUsername
} from 'app/reducers/feeds';

function loadData(params, props) {
  const { username } = params;
  if (!props.user) {
    props.fetchUser(username);
  }
  if (!props.feed) {
    props.fetchUserFeed(username);
  }
}

function mapStateToProps(state, props) {
  const username = props.params.username || state.auth.username;

  const feed = selectFeedById(state, { feedId: feedIdByUsername(username) });
  const feedItems = selectFeedActivitesByFeedId(state, {
    feedId: feedIdByUsername(username)
  });

  return {
    username,
    isMe: !props.params.username ||
      props.params.username === state.auth.username,
    auth: state.auth,
    user: state.users.byId[username],
    loggedIn: state.auth.token !== null,
    feed,
    feedItems
  };
}

const mapDispatchToProps = { fetchUser, fetchUserFeed };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['username'], loadData)
)(UserProfile);
