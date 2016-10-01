// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchAll } from 'app/actions/EventActions';
import EventList from './components/EventList';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { selectEvents } from 'app/reducers/events';

function loadData(params, props) {
  props.fetchAll();
}

function mapStateToProps(state) {
  const events = selectEvents(state);
  return {
    events
  };
}

const mapDispatchToProps = { fetchAll };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['loggedIn'], loadData)
)(EventList);
