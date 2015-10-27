import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import GroupTree from '../components/GroupTree';
import { fetchAll } from '../actions/GroupActions';

function loadData(props) {
  props.fetchAll();
}

@connect(
  (state) => ({
    groups: state.groups.items || []
  }),
  { fetchAll }
)
export default class EventsContainer extends Component {
  static propTypes = {
    groups: PropTypes.array
  };

  componentWillMount() {
    loadData(this.props);
  }

  render() {
    return <GroupTree {...this.props} />;
  }
}
