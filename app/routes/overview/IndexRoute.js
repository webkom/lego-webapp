import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchAll } from 'app/actions/EventActions';
import { login, logout } from 'app/actions/UserActions';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import Overview from './components/Overview';

function loadData(params, props) {
  props.fetchAll();
}

function mapStateToProps(state) {
  return {
    loggedIn: state.auth.token !== null,
    user: state.auth.token !== null && state.users.byId[state.auth.username],
    events: state.events.items.map((id) => state.events.byId[id])
  };
}

const mapDispatchToProps = { fetchAll, login, logout };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['loggedIn'], loadData)
)(Overview);
