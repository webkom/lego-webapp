import React, { Component } from 'react';
import { connect } from 'react-redux';
import GroupPage from '../components/GroupPage';
import fetchOnUpdate from '../decorators/fetchOnUpdate';
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
export default class GroupPageContainer extends Component {
  render() {
    return <GroupPage {...this.props} />;
  }
}
