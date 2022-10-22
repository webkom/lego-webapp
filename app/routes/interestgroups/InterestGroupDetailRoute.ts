import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  joinGroup,
  leaveGroup,
  fetchGroup,
  fetchAllMemberships,
} from 'app/actions/GroupActions';
import InterestGroupDetail from './components/InterestGroupDetail';
import { selectMembershipsForGroup } from 'app/reducers/memberships';
import { selectGroup } from 'app/reducers/groups';
import loadingIndicator from 'app/utils/loadingIndicator';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';

const mapStateToProps = (state, props) => {
  const { interestGroupId } = props.match.params;
  const group = selectGroup(state, {
    groupId: interestGroupId,
  });
  const memberships = selectMembershipsForGroup(state, {
    groupId: interestGroupId,
  });
  return {
    group: { ...group, memberships },
    interestGroupId,
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
        dispatch(fetchGroup(Number(props.match.params.interestGroupId))),
        dispatch(fetchAllMemberships(props.match.params.interestGroupId)),
      ]),
    (props) => [props.match.params.interestGroupId]
  ),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['group'])
)(InterestGroupDetail);
