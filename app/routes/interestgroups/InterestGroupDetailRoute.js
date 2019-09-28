import { compose } from 'redux';
import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import {
  fetchInterestGroup,
  joinInterestGroup,
  leaveInterestGroup
} from 'app/actions/InterestGroupActions';
import InterestGroupDetail from './components/InterestGroupDetail';
import { selectMembershipsForGroup } from 'app/reducers/memberships';
import { selectGroup } from 'app/reducers/groups';
import loadingIndicator from 'app/utils/loadingIndicator';

const mapStateToProps = (state, props) => {
  const { interestGroupId } = props.match.params;
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
  prepare(({ match: { params: { interestGroupId } } }, dispatch) =>
    dispatch(fetchInterestGroup(Number(interestGroupId)))
  ),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  loadingIndicator(['group'])
)(InterestGroupDetail);
