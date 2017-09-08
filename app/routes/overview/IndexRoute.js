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

const mapStateToProps = state => ({
  events: selectEvents(state)
});

const mapDispatchToProps = { fetchAll, login, logout };

export default compose(
  replaceUnlessLoggedIn(PublicFrontpage),
  dispatched(({ loggedIn }, dispatch) =>
    dispatch(fetchAll({ dateAfter: moment().format('YYYY-MM-DD') }))
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(Overview);
