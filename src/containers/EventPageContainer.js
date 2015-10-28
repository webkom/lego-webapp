import React, { Component } from 'react';
import { connect } from 'react-redux';
import EventPage from '../components/EventPage';
import fetchOnUpdate from '../utils/fetchOnUpdate';
import { fetchEvent } from '../actions/EventActions';

function loadData({ eventId }, props) {
  props.fetchEvent(Number(eventId));
}

@connect(
  (state, props) => ({
    loggedIn: state.auth.token !== null,
    event: state.events.items.find(
      event => event.id === Number(props.params.eventId)
    )
  }),
  { fetchEvent }
)
@fetchOnUpdate(['eventId'], loadData)
export default class EventPageContainer extends Component {
  render() {
    return <EventPage {...this.props} />;
  }
}
