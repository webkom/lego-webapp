import { compose } from 'redux';
import { connect } from 'react-redux';

import TimelinePage from './components/TimelinePage';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { LoginPage } from 'app/components/LoginForm';
import { fetchPersonalFeed } from 'app/actions/FeedActions';
import {
  selectFeedById,
  selectFeedActivitesByFeedId,
} from 'app/reducers/feeds';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';

const mapStateToProps = (state: Record<string, any>) => ({
  feed: selectFeedById(state, {
    feedId: 'personal',
  }),
  feedItems: selectFeedActivitesByFeedId(state, {
    feedId: 'personal',
  }),
});

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  withPreparedDispatch('fetchTimeline', (_, dispatch) =>
    dispatch(fetchPersonalFeed())
  ),
  connect(mapStateToProps)
)(TimelinePage);
