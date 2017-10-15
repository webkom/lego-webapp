import { compose } from 'redux';
import { connect } from 'react-redux';
import GroupView from './components/GroupView';
import { fetchGroup, updateGroup } from 'app/actions/GroupActions';
import { selectGroup } from 'app/reducers/groups';
import prepare from 'app/utils/prepare';

function mapStateToProps(state, props) {
  const { groupId } = props.routeParams;
  return {
    loggedIn: props.loggedIn,
    group: selectGroup(state, { groupId }),
    groupId
  };
}

const mapDispatchToProps = { fetchGroup, updateGroup };

function loadData({ groupId }, dispatch) {
  return dispatch(fetchGroup(groupId));
}
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  prepare(loadData, ['groupId'])
)(GroupView);
