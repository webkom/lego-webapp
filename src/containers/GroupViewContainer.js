import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import GroupView from '../components/GroupView';
import fetchOnUpdate from '../utils/fetchOnUpdate';
import { fetchGroup } from '../actions/GroupActions';

function loadData({ groupId }, props) {
  props.fetchGroup(Number(groupId));
}

@connect(
  (state, props) => ({
    loggedIn: state.auth.token !== null,
    group: state.groups.items.find(
      group => group.id === Number(props.params.groupId)
    )
  }),
  { fetchGroup }
)
@fetchOnUpdate(['groupId'], loadData)
export default class GroupViewContainer extends Component {
  static propTypes = {
    params: PropTypes.object
  }
  render() {
    return <GroupView {...this.props} />;
  }
}
