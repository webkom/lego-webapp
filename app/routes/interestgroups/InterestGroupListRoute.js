// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import {
  fetchAll,
  createInterestGroup
} from 'app/actions/InterestGroupActions';
import InterestGroupList from './components/InterestGroupList';
import { selectGroupsWithType } from 'app/reducers/groups';

const mapStateToProps = state => ({
  interestGroups: selectGroupsWithType(state, { groupType: 'interesse' }),
  actionGrant: state.groups.actionGrant
});

const mapDispatchToProps = { fetchAll, createInterestGroup };

export default compose(
  prepare((props, dispatch) => dispatch(fetchAll())),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(InterestGroupList);
