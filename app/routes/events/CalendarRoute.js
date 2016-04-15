import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAll } from 'app/actions/EventActions';
import Calendar from './components/Calendar';

function loadData(props) {
  props.fetchAll();
}

export default class CalendarRoute extends Component {
  componentWillMount() {
    loadData(this.props);
  }

  render() {
    return <Calendar {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    events: state.events.items
  };
}

const mapDispatchToProps = { fetchAll };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarRoute);
