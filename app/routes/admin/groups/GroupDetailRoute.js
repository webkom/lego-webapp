import { compose } from 'redux';
import { connect } from 'react-redux';
import GroupView from './components/GroupView';
import { fetchGroup } from 'app/actions/GroupActions';
import { selectGroup } from 'app/reducers/groups';
import prepare from 'app/utils/prepare';

function mapStateToProps(state, props) {
  const { groupId } = props.match.params;
  const { match } = props;
  return {
    group: selectGroup(state, { groupId }),
    groupId,
    match,
  };
}

function loadData({ match: { params } }, dispatch) {
  return dispatch(fetchGroup(params.groupId));
}
export default compose(
  prepare(loadData, ['match.params.groupId']),
  connect(mapStateToProps, {})
)(GroupView);
