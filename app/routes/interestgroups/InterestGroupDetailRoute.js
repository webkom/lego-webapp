import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';
import {
  fetchInterestGroup,
  joinInterestGroup,
  leaveInterestGroup
} from 'app/actions/InterestGroupActions';
import InterestGroupDetail from './components/InterestGroupDetail';
import { selectMembershipsForInterestGroup } from 'app/reducers/memberships';
import { selectInterestGroupById } from 'app/reducers/interestGroups';

const mapStateToProps = (state, { params: { interestGroupId } }) => {
  const group = selectInterestGroupById(state, { interestGroupId });
  const memberships = selectMembershipsForInterestGroup(state, {
    interestGroupId
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
    ({ params: { interestGroupId } }, dispatch) => dispatch(fetchInterestGroup(interestGroupId)),
    {
      componentWillReceiveProps: false
    }
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(InterestGroupDetail);
