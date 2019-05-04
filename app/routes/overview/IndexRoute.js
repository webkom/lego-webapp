import { compose } from 'redux';
import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import { fetchData, fetchReadmes } from 'app/actions/FrontpageActions';
import { login, logout } from 'app/actions/UserActions';
import Overview from './components/Overview';
import { selectFrontpage } from 'app/reducers/frontpage';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import PublicFrontpage from './components/PublicFrontpage';
import { fetchPersonalFeed } from 'app/actions/FeedActions';
import {
  selectFeedById,
  selectFeedActivitesByFeedId
} from 'app/reducers/feeds';
import { selectPinnedPolls } from 'app/reducers/polls';
import { votePoll } from 'app/actions/PollActions';
import { frontloadConnect } from 'react-frontload';

const mapStateToProps = state => ({
  loadingFrontpage: state.frontpage.fetching,
  frontpage: selectFrontpage(state),
  feed: selectFeedById(state, { feedId: 'personal' }),
  feedItems: selectFeedActivitesByFeedId(state, {
    feedId: 'personal'
  }),
  readmes: state.readme,
  poll: selectPinnedPolls(state)[0]
});

const readmes = props => {
  props.fetchReadmes(props.loggedIn ? 4 : 1);
  props.loggedIn ? fetchPersonalFeed() : Promise.resolve();
  props.fetchData();
};

const mapDispatchToProps = { login, logout, votePoll, fetchReadmes, fetchData };

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  frontloadConnect(readmes, {
    onMount: true,
    onUpdate: false
  }),
  replaceUnlessLoggedIn(PublicFrontpage)
)(Overview);
