import { compose } from 'redux';
import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import { fetchData, fetchReadmes } from 'app/actions/FrontpageActions';
import { login, logout } from 'app/actions/UserActions';
import { isEmpty } from 'lodash';
import Overview from './components/Overview';
import { selectFrontpage } from 'app/reducers/frontpage';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import PublicFrontpage from './components/PublicFrontpage';
import { selectRandomQuote } from 'app/reducers/quotes';
import { fetchRandomQuote } from 'app/actions/QuoteActions';
// import { fetchPersonalFeed } from 'app/actions/FeedActions';
import {
  selectFeedById,
  selectFeedActivitesByFeedId,
} from 'app/reducers/feeds';
import { selectPinnedPolls } from 'app/reducers/polls';
import { votePoll } from 'app/actions/PollActions';
import { fetchRandomInterestgroups } from 'app/actions/GroupActions';
import { selectRandomInterestgroups } from 'app/reducers/groups';

const mapStateToProps = (state) => ({
  frontpage: selectFrontpage(state),
  feed: selectFeedById(state, { feedId: 'personal' }),
  shouldFetchQuote: isEmpty(selectRandomQuote(state)),
  shouldFetchInterestgroups: isEmpty(selectRandomInterestgroups(state)),
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
    ({ shouldFetchQuote, shouldFetchInterestgroups, loggedIn }, dispatch) =>
      Promise.all([
        loggedIn && shouldFetchQuote && dispatch(fetchRandomQuote()),
        dispatch(fetchReadmes(loggedIn ? 4 : 1)),
        loggedIn &&
          shouldFetchInterestgroups &&
          dispatch(fetchRandomInterestgroups()),
      ]),
    [],
    { awaitOnSsr: false }
  ),
  prepare(({ loggedIn }, dispatch) => dispatch(fetchData())),
  replaceUnlessLoggedIn(PublicFrontpage)
)(Overview);
