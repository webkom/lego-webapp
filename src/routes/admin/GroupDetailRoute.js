import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import GroupView from './components/GroupView';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { fetchGroup, updateGroup } from '🏠/actions/GroupActions';

function loadData({ groupId }, props) {
  props.fetchGroup(Number(groupId));
}

function findGroup({ groups, users }, groupId) {
  const foundGroup = groups.items.find(
    group => group.id === Number(groupId)
  );

  if (foundGroup && foundGroup.users) {
    const mappedUsers = foundGroup.users.map(username => users[username]);
    return { ...foundGroup, users: mappedUsers };
  }

  return foundGroup;
}

@connect(
  (state, props) => ({
    loggedIn: state.auth.token !== null,
    group: findGroup(state, props.params.groupId)
  }),
  { fetchGroup, updateGroup }
)
@fetchOnUpdate(['groupId'], loadData)
export default class GroupViewContainer extends Component {
  static propTypes = {
    params: PropTypes.object
  };

  render() {
    return <GroupView {...this.props} />;
  }
}
