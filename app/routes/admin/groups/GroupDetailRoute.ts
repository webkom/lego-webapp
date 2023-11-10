import { connect } from 'react-redux';
import { compose } from 'redux';
import { fetchGroup } from 'app/actions/GroupActions';
import { selectGroup } from 'app/reducers/groups';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import GroupView from './components/GroupView';

function mapStateToProps(state, props) {
  const { groupId } = props.match.params;
  const { match } = props;
  return {
    group: selectGroup(state, {
      groupId,
    }),
    groupId,
    match,
  };
}

export default compose(
  withPreparedDispatch(
    'fetchGroupDetail',
    (props, dispatch) => dispatch(fetchGroup(props.match.params.groupId)),
    (props) => [props.match.params.groupId],
  ),
  connect(mapStateToProps, {}),
)(GroupView);
