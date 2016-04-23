import { compose } from 'redux';
import { connect } from 'react-redux';
import GroupView from './components/GroupView';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { fetchGroup, updateGroup } from 'app/actions/GroupActions';

function loadData(params, props) {
  props.fetchGroup(Number(params.groupId));
}

function findGroup({ groups, users }, groupId) {
  const foundGroup = groups.items.find(
    (group) => group.id === Number(groupId)
  );

  if (foundGroup && foundGroup.users) {
    const mappedUsers = foundGroup.users.map((username) => users[username]);
    return { ...foundGroup, users: mappedUsers };
  }

  return foundGroup;
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
