import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { compose } from 'redux';

import { fetchData, fetchReadmes } from 'app/actions/FrontpageActions';
import { votePoll } from 'app/actions/PollActions';
import { fetchRandomQuote } from 'app/actions/QuoteActions';
import { login, logout } from 'app/actions/UserActions';
// import { fetchPersonalFeed } from 'app/actions/FeedActions';
import {
  selectFeedActivitesByFeedId,
  selectFeedById,
} from 'app/reducers/feeds';
import { selectFrontpage } from 'app/reducers/frontpage';
import { selectPinnedPolls } from 'app/reducers/polls';
import { selectRandomQuote } from 'app/reducers/quotes';
import prepare from 'app/utils/prepare';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import Overview from './components/Overview';
import PublicFrontpage from './components/PublicFrontpage';

const mapStateToProps = (state) => ({
  frontpage: selectFrontpage(state),
  feed: selectFeedById(state, { feedId: 'personal' }),
  shouldFetchQuote: isEmpty(selectRandomQuote(state)),
  feedItems: selectFeedActivitesByFeedId(state, {
    feedId: 'personal',
  }),
  readmes: state.readme,
  poll: selectPinnedPolls(state)[0],
});

const mapDispatchToProps = { login, logout, votePoll };

export default compose(
  // Feed not in use
  // prepare(({ loggedIn }, dispatch) =>
  //   loggedIn ? dispatch(fetchPersonalFeed()) : Promise.resolve()
  // ),
  connect(mapStateToProps, mapDispatchToProps),
  prepare(
    ({ shouldFetchQuote, loggedIn }, dispatch) =>
      Promise.all([
        loggedIn && shouldFetchQuote && dispatch(fetchRandomQuote()),
        dispatch(fetchReadmes(loggedIn ? 4 : 1)),
      ]),
    [],
    { awaitOnSsr: false }
  ),
  prepare(({ loggedIn }, dispatch) => dispatch(fetchData())),
  replaceUnlessLoggedIn(PublicFrontpage)
)(Overview);
