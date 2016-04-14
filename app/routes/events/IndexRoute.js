import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchAll } from 'app/actions/EventActions';

function loadData(props) {
  props.fetchAll();
}

@connect((state) => ({
  events: state.events.items
}), { fetchAll })
export default class EventsRoot extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired
  };

  componentWillMount() {
    loadData(this.props);
  }

  render() {
    const props = { ...this.props };
    delete props.ref;
    delete props.key;
    return React.cloneElement(this.props.children, props);
  }
}
