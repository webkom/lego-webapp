import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchAll } from 'app/actions/EventActions';
import { login, logout } from 'app/actions/UserActions';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import Overview from './components/Overview';
import { selectEvents } from 'app/reducers/events';

function loadData(params, props) {
  props.fetchAll();
}

function mapStateToProps(state) {
  return {
    events: selectEvents(state)
  };
}

const mapDispatchToProps = { fetchAll, login, logout };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['loggedIn'], loadData)
)(Overview);
