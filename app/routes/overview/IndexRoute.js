import { compose } from 'redux';
import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import { fetch } from 'app/actions/FrontpageActions';
import { login, logout } from 'app/actions/UserActions';
import Overview from './components/Overview';
import { selectFrontpage } from 'app/reducers/frontpage';
import { selectArticleById } from 'app/reducers/articles';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import PublicFrontpage from './components/PublicFrontpage';
import { fetchPersonalFeed } from 'app/actions/FeedActions';
import {
  selectFeedById,
  selectFeedActivitesByFeedId
} from 'app/reducers/feeds';

const mapStateToProps = state => ({
  loadingFrontpage: state.frontpage.fetching,
  frontpage: selectFrontpage(state),
  feed: selectFeedById(state, { feedId: 'personal' }),
  feedItems: selectFeedActivitesByFeedId(state, {
    feedId: 'personal'
  }),
  // Hardcoded pk of Fadderperiode 2018 article
  fp: selectArticleById(state, { articleId: 127 })
});

const mapDispatchToProps = { login, logout };

export default compose(
  prepare(({ loggedIn }, dispatch) =>
    dispatch(fetch()).then(
      () => (loggedIn ? dispatch(fetchPersonalFeed()) : Promise.resolve())
    )
  ),
  connect(mapStateToProps, mapDispatchToProps),
  replaceUnlessLoggedIn(PublicFrontpage)
)(Overview);
