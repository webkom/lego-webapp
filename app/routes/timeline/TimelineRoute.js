// @flow

import { connect } from 'react-redux';
import { compose } from 'redux';

import { fetchPersonalFeed } from 'app/actions/FeedActions';
import { LoginPage } from 'app/components/LoginForm';
import {
  selectFeedActivitesByFeedId,
  selectFeedById,
} from 'app/reducers/feeds';
import prepare from 'app/utils/prepare';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import TimelinePage from './components/TimelinePage';

const loadData = (props, dispatch) => {
  return dispatch(fetchPersonalFeed());
};

const mapStateToProps = (state: Object) => ({
  feed: selectFeedById(state, { feedId: 'personal' }),
  feedItems: selectFeedActivitesByFeedId(state, {
    feedId: 'personal',
  }),
});

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(loadData),
  // $FlowFixMe
  connect(mapStateToProps)
)(TimelinePage);
