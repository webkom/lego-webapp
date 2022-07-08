import { connect } from 'react-redux';
import { compose } from 'redux';

import {
  fetchAllMemberships,
  fetchGroup,
  joinGroup,
  leaveGroup,
} from 'app/actions/GroupActions';
import { selectGroup } from 'app/reducers/groups';
import { selectMembershipsForGroup } from 'app/reducers/memberships';
import loadingIndicator from 'app/utils/loadingIndicator';
import prepare from 'app/utils/prepare';
import InterestGroupDetail from './components/InterestGroupDetail';

const mapStateToProps = (state, props) => {
  const { interestGroupId } = props.match.params;
  const group = selectGroup(state, { groupId: interestGroupId });
  const memberships = selectMembershipsForGroup(state, {
    groupId: interestGroupId,
  });

  return {
    group: {
      ...group,
      memberships,
    },
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
