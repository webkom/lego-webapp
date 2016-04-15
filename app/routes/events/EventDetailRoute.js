import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { fetchEvent } from 'app/actions/EventActions';
import EventDetail from './components/EventDetail';

function loadData({ eventId }, props) {
  props.fetchEvent(Number(eventId));
}

class EventDetailRoute extends Component {
  render() {
    return <EventDetail {...this.props} />;
  }
}

function mapStateToProps(state, props) {
  return {
    loggedIn: state.auth.token !== null,
    events: state.events.items.find((event) =>
      event.id === +props.params.eventId)
  };
}

const mapDispatchToProps = { fetchEvent };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['eventId'], loadData),
)(EventDetailRoute);
