import { compose } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { dispatched } from 'react-prepare';
import { fetchAll } from 'app/actions/EventActions';
import { login, logout } from 'app/actions/UserActions';
import Overview from './components/Overview';
import { selectEvents } from 'app/reducers/events';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import PublicFrontpage from './components/PublicFrontpage';
import { fetchPersonalFeed } from 'app/actions/FeedActions';
import {
  selectFeedById,
  selectFeedActivitesByFeedId
} from 'app/reducers/feeds';

const mapStateToProps = state => ({
  events: selectEvents(state),
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
      dispatch(fetchAll({ dateAfter: moment().format('YYYY-MM-DD') })).then(
        () => (loggedIn ? dispatch(fetchPersonalFeed()) : Promise.resolve())
      ),
    {
      componentWillReceiveProps: false
    }
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(Overview);
