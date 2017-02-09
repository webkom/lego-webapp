import { compose } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { fetchAll } from 'app/actions/EventActions';
import { login, logout } from 'app/actions/UserActions';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import Overview from './components/Overview';
import { selectEvents } from 'app/reducers/events';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import PublicFrontpage from './components/PublicFrontpage';

function loadData(params, props) {
  props.fetchAll({ dateAfter: moment().format('YYYY-MM-DD') });
}

function mapStateToProps(state) {
  return {
    events: selectEvents(state)
  };
}

const mapDispatchToProps = { fetchAll, login, logout };

export default compose(
  replaceUnlessLoggedIn(PublicFrontpage),
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['loggedIn'], loadData)
)(Overview);
