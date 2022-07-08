// @flow

import { connect } from 'react-redux';
import { compose } from 'redux';

import { fetchAllWithType } from 'app/actions/GroupActions';
import { LoginPage } from 'app/components/LoginForm';
import { GroupTypeInterest } from 'app/models';
import { selectGroupsWithType } from 'app/reducers/groups';
import prepare from 'app/utils/prepare';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import InterestGroupList from './components/InterestGroupList';

const groupType = GroupTypeInterest;
const mapStateToProps = (state) => ({
  interestGroups: selectGroupsWithType(state, { groupType }),
  actionGrant: state.groups.actionGrant,
});

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare((props, dispatch) => dispatch(fetchAllWithType(groupType))),
  connect(mapStateToProps, {})
)(InterestGroupList);
