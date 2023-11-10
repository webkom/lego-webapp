import { connect } from 'react-redux';
import { compose } from 'redux';

import { fetchPersonalFeed } from 'app/actions/FeedActions';
import { LoginPage } from 'app/components/LoginForm';
import {
  selectFeedById,
  selectFeedActivitesByFeedId,
} from 'app/reducers/feeds';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import TimelinePage from './components/TimelinePage';

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
    dispatch(fetchPersonalFeed()),
  ),
  connect(mapStateToProps),
)(TimelinePage);
