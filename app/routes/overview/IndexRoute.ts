import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchData, fetchReadmes } from 'app/actions/FrontpageActions';
import { login, logout } from 'app/actions/UserActions';
import { isEmpty } from 'lodash';
import Overview from './components/Overview';
import { selectFrontpage } from 'app/store/slices/frontpageSlice';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import PublicFrontpage from './components/PublicFrontpage';
import { selectRandomQuote } from 'app/store/slices/quotesSlice';
import { fetchRandomQuote } from 'app/actions/QuoteActions';
// import { fetchPersonalFeed } from 'app/actions/FeedActions';
import {
  selectFeedById,
  selectFeedActivitesByFeedId,
} from 'app/store/slices/feedsSlice';
import { selectPinnedPolls } from 'app/store/slices/pollsSlice';
import { votePoll } from 'app/actions/PollActions';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';

const mapStateToProps = (state) => ({
  frontpage: selectFrontpage(state),
  feed: selectFeedById(state, {
    feedId: 'personal',
  }),
  shouldFetchQuote: isEmpty(selectRandomQuote(state)),
  feedItems: selectFeedActivitesByFeedId(state, {
    feedId: 'personal',
  }),
  readmes: state.readme,
  poll: selectPinnedPolls(state)[0],
});

const mapDispatchToProps = {
  login,
  logout,
  votePoll,
};
export default compose(
  // Feed not in use
  // prepare(({ loggedIn }, dispatch) =>
  //   loggedIn ? dispatch(fetchPersonalFeed()) : Promise.resolve()
  // ),
  connect(mapStateToProps, mapDispatchToProps),
  withPreparedDispatch('fetchIndex', (props, dispatch) =>
    Promise.all([
      props.loggedIn && props.shouldFetchQuote && dispatch(fetchRandomQuote()),
      dispatch(fetchReadmes(props.loggedIn ? 4 : 1)),
      dispatch(fetchData()),
    ])
  ),
  replaceUnlessLoggedIn(PublicFrontpage)
)(Overview);
