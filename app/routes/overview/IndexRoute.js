import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchAll } from 'app/actions/EventActions';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import Overview from './components/Overview';

function loadData(params, props) {
  props.fetchAll();
}

function mapStateToProps(state) {
  return {
    loggedIn: state.auth.token !== null,
    events: state.events.items.map((id) => state.entities.events[id])
  };
}

const mapDispatchToProps = { fetchAll };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['loggedIn'], loadData)
)(Overview);
