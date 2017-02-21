import { compose } from 'redux';
import { connect } from 'react-redux';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { fetchInterestGroup, updateInterestGroup, removeInterestGroup } from 'app/actions/InterestGroupActions';
import InterestGroupDetail from './components/InterestGroupDetail';
import { selectInterestGroupById } from 'app/reducers/interestGroups';

function loadData({ interestGroupId }, props) {
  props.fetchInterestGroup(Number(interestGroupId));
}

function mapStateToProps(state, props) {
  const { interestGroupId } = props.params;
  const group = selectInterestGroupById(state, { interestGroupId });

  return {
    group,
    interestGroupId
  };
}

const mapDispatchToProps = { fetchInterestGroup, updateInterestGroup, removeInterestGroup };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['interestGroupId', 'loggedIn'], loadData),
)(InterestGroupDetail);
