import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import EventCalendar from '../components/EventCalendar';

@connect(state => ({
  events: state.events.items
}))
export default class EventsContainer extends Component {
  render() {
    return <EventCalendar />;
  }
}
