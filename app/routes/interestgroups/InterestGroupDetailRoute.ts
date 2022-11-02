import { compose } from 'redux';
import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
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
  prepare(
    (
      {
        match: {
          params: { interestGroupId },
        },
      },
      dispatch
    ) =>
      Promise.all([
        dispatch(fetchGroup(Number(interestGroupId))),
        dispatch(fetchAllMemberships(interestGroupId)),
      ]),
    ['match.params.interestGroupId']
  ),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['group'])
)(InterestGroupDetail);
