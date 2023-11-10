import { isEmpty } from 'lodash';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { fetchData, fetchReadmes } from 'app/actions/FrontpageActions';
import { votePoll } from 'app/actions/PollActions';
import { fetchRandomQuote } from 'app/actions/QuoteActions';
import { login, logout } from 'app/actions/UserActions';
import {
  selectFeedById,
  selectFeedActivitesByFeedId,
} from 'app/reducers/feeds';
import { selectFrontpage } from 'app/reducers/frontpage';
import { selectPinnedPolls } from 'app/reducers/polls';
import { selectRandomQuote } from 'app/reducers/quotes';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
// import { fetchPersonalFeed } from 'app/actions/FeedActions';
import Overview from './components/Overview';
import PublicFrontpage from './components/PublicFrontpage';

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
  fetchingFrontpage: state.frontpage.fetching,
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
  withPreparedDispatch(
    'fetchIndex',
    (props, dispatch) =>
      Promise.all([
        props.loggedIn &&
          props.shouldFetchQuote &&
          dispatch(fetchRandomQuote()),
        dispatch(fetchReadmes(props.loggedIn ? 4 : 2)),
        dispatch(fetchData()),
      ]),
    (props) => [props.loggedIn, props.shouldFetchQuote],
  ),
  replaceUnlessLoggedIn(PublicFrontpage),
)(Overview);
