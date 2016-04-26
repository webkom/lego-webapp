import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import GroupPage from './components/GroupPage';
import { fetchAll } from 'app/actions/GroupActions';

function loadData(props) {
  props.fetchAll();
}

@connect((state) => ({
  groups: state.groups.items.map((id) => state.entities.groups[id])
}), { fetchAll })
export default class GroupsRoute extends Component {
  static propTypes = {
    groups: PropTypes.array
  };

  componentWillMount() {
    loadData(this.props);
  }

  render() {
    return <GroupPage {...this.props} />;
  }
}
