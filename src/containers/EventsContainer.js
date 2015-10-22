import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import EventCalendar from '../components/EventCalendar';
import { fetchAll } from '../actions/EventActions';

function loadData(props) {
  props.fetchAll();
}

@connect(
  (state) => ({
    events: state.events.items
  }),
  { fetchAll }
)
export default class EventsContainer extends Component {
  static propTypes = {
    children: PropTypes.array
  };

  componentWillMount() {
    loadData(this.props);
  }

  render() {
    return this.props.children || <EventCalendar />;
  }
}
