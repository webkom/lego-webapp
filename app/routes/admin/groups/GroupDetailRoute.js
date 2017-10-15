import { compose } from 'redux';
import { connect } from 'react-redux';
import GroupView from './components/GroupView';
import { dispatched } from '@webkom/react-prepare';
import { fetchGroup, updateGroup } from 'app/actions/GroupActions';
import { selectGroup } from 'app/reducers/groups';

function mapStateToProps(state, props) {
  const { groupId } = props.routeParams;
  return {
    loggedIn: props.loggedIn,
    group: selectGroup(state, { groupId }),
    groupId
  };
}

const mapDispatchToProps = { fetchGroup, updateGroup };

export default compose(
  dispatched(({ params: { groupId } }, dispatch) =>
    dispatch(fetchGroup(groupId))
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(GroupView);
