// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import { fetchAllWithType } from 'app/actions/GroupActions';
import InterestGroupList from './components/InterestGroupList';
import { selectGroupsWithType } from 'app/reducers/groups';

const mapStateToProps = (state) => ({
  interestGroups: selectGroupsWithType(state, { groupType: 'interesse' }),
  actionGrant: state.groups.actionGrant,
});

export default compose(
  prepare((props, dispatch) => dispatch(fetchAllWithType('interesse'))),
  connect(mapStateToProps, {})
)(InterestGroupList);
