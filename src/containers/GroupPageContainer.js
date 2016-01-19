import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import GroupPage from '../components/GroupPage';
import { fetchAll } from '../actions/GroupActions';

function loadData(props) {
  props.fetchAll();
}

@connect(
  state => ({
    groups: state.groups.items || []
  }),
  { fetchAll }
)
export default class GroupPageContainer extends Component {
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
