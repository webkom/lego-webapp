import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import EventPage from './components/EventPage';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { fetchEvent } from 'app/actions/EventActions';

function loadData({ eventId }, props) {
  props.fetchEvent(Number(eventId));
}

@connect((state, props) => ({
  loggedIn: state.auth.token !== null,
  event: state.events.items.find(
    event => event.id === Number(props.params.eventId)
  )
}), { fetchEvent })
@fetchOnUpdate(['eventId'], loadData)
export default class EventDetailRoute extends Component {

  static propTypes = {
    params: PropTypes.object.isRequired
  };

  render() {
    return <EventPage {...this.props} />;
  }
}
