import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from '@webkom/react-prepare';
import { fetch } from 'app/actions/FrontpageActions';
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

const mapStateToProps = state => ({
  frontpage: selectFrontpage(state),
  feed: selectFeedById(state, { feedId: 'personal' }),
  feedItems: selectFeedActivitesByFeedId(state, {
    feedId: 'personal'
  })
});

const mapDispatchToProps = { login, logout };

export default compose(
  replaceUnlessLoggedIn(PublicFrontpage),
  dispatched(
    ({ loggedIn }, dispatch) =>
      dispatch(fetch()).then(
        () => (loggedIn ? dispatch(fetchPersonalFeed()) : Promise.resolve())
      ),
    {
      componentWillReceiveProps: false
    }
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(Overview);
