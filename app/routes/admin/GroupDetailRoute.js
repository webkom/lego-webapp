import { compose } from 'redux';
import { connect } from 'react-redux';
import GroupView from './components/GroupView';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { fetchGroup, updateGroup } from 'app/actions/GroupActions';

function loadData(params, props) {
  props.fetchGroup(Number(params.groupId));
}

function findGroup(state, groupId) {
  const group = state.entities.groups[groupId];

  if (group && group.users) {
    return {
      ...group,
      users: group.users.map((userId) => state.entities.users[userId])
    };
  }

  return group;
}

function mapStateToProps(state, props) {
  return {
    loggedIn: state.auth.token !== null,
    group: findGroup(state, props.routeParams.groupId),
    groupId: props.routeParams.groupId
  };
}

const mapDispatchToProps = { fetchGroup, updateGroup };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['groupId'], loadData)
)(GroupView);
