import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

@connect(state => ({
  events: state.events.items
}))
export default class EventsContainer extends Component {
  render() {
    return <div>Events</div>;
  }
}
