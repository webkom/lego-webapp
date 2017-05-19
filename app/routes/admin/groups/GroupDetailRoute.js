import { compose } from 'redux';
import { connect } from 'react-redux';
import GroupView from './components/GroupView';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { fetchGroup, updateGroup } from 'app/actions/GroupActions';
import { selectGroup } from 'app/reducers/groups';

function loadData(params, props) {
  props.fetchGroup(Number(params.groupId));
}

function mapStateToProps(state, props) {
  const { groupId } = props.routeParams;
  return {
    loggedIn: state.auth.token !== null,
    group: selectGroup(state, { groupId }),
    groupId
  };
}

const mapDispatchToProps = { fetchGroup, updateGroup };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['groupId'], loadData)
)(GroupView);
