import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';
import {
  fetchInterestGroup,
  updateInterestGroup,
  removeInterestGroup
} from 'app/actions/InterestGroupActions';
import InterestGroupDetail from './components/InterestGroupDetail';
import { selectInterestGroupById } from 'app/reducers/interestGroups';

const mapStateToProps = (state, { params: interestGroupId }) => ({
  group: selectInterestGroupById(state, { interestGroupId }),
  interestGroupId
});

const mapDispatchToProps = {
  fetchInterestGroup,
  updateInterestGroup,
  removeInterestGroup
};

export default compose(
  dispatched(
    ({ params: { interestGroupId } }, dispatch) =>
      dispatch(fetchInterestGroup(interestGroupId)),
    {
      componentWillReceiveProps: false
    }
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(InterestGroupDetail);
