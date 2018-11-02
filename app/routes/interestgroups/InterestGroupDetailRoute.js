import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from '@webkom/react-prepare';
import {
  fetchInterestGroup,
  joinInterestGroup,
  leaveInterestGroup
} from 'app/actions/InterestGroupActions';
import InterestGroupDetail from './components/InterestGroupDetail';
import { selectMembershipsForGroup } from 'app/reducers/memberships';
import { selectGroup } from 'app/reducers/groups';
import loadingIndicator from 'app/utils/loadingIndicator';

const mapStateToProps = (state, { params: { interestGroupId } }) => {
  const group = selectGroup(state, { groupId: interestGroupId });
  const memberships = selectMembershipsForGroup(state, {
    groupId: interestGroupId
  });

  return {
    group: {
      ...group,
      memberships
    },
    interestGroupId
  };
};

const mapDispatchToProps = {
  fetchInterestGroup,
  joinInterestGroup,
  leaveInterestGroup
};

export default compose(
  dispatched(
    ({ params: { interestGroupId } }, dispatch) =>
      dispatch(fetchInterestGroup(Number(interestGroupId))),
    {
      componentWillReceiveProps: false
    }
  ),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  loadingIndicator(['group'])
)(InterestGroupDetail);
