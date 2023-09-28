import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  joinGroup,
  leaveGroup,
  fetchGroup,
  fetchAllMemberships,
} from 'app/actions/GroupActions';
import { selectGroup } from 'app/reducers/groups';
import { selectMembershipsForGroup } from 'app/reducers/memberships';
import loadingIndicator from 'app/utils/loadingIndicator';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import InterestGroupDetail from './components/InterestGroupDetail';

const mapStateToProps = (state, props) => {
  const { groupId } = props.match.params;
  const group = selectGroup(state, {
    groupId,
  });
  const memberships = selectMembershipsForGroup(state, {
    groupId,
  });
  return {
    group: { ...group, memberships },
  };
};

const mapDispatchToProps = {
  joinGroup,
  leaveGroup,
};
export default compose(
  withPreparedDispatch(
    'fetchInterestGroupDetail',
    (props, dispatch) =>
      Promise.all([
        dispatch(fetchGroup(Number(props.match.params.groupId))),
        dispatch(fetchAllMemberships(props.match.params.groupId)),
      ]),
    (props) => [props.match.params.groupId]
  ),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['group'])
)(InterestGroupDetail);
