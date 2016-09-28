import { compose } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { fetchAll } from 'app/actions/EventActions';
import { login, logout } from 'app/actions/UserActions';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import Overview from './components/Overview';

function loadData(params, props) {
  props.fetchAll();
}

const selectEvents = createSelector(
  (state) => state.events.byId,
  (state) => state.events.items,
  (eventsById, eventIds) => eventIds.map((id) => eventsById[id])
);

function mapStateToProps(state) {
  return {
    loggedIn: state.auth.token !== null,
    user: state.auth.token !== null && state.users.byId[state.auth.username],
    events: selectEvents(state)
  };
}

const mapDispatchToProps = { fetchAll, login, logout };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['loggedIn'], loadData)
)(Overview);
