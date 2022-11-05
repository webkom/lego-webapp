import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchAllWithType } from 'app/actions/GroupActions';
import InterestGroupList from './components/InterestGroupList';
import { selectGroupsWithType } from 'app/reducers/groups';
import { GroupTypeInterest } from 'app/models';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';

const groupType = GroupTypeInterest;

const mapStateToProps = (state) => ({
  interestGroups: selectGroupsWithType(state, {
    groupType,
  }),
  actionGrant: state.groups.actionGrant,
});

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  withPreparedDispatch('fetchInterestGroupList', (props, dispatch) =>
    dispatch(fetchAllWithType(groupType))
  ),
  connect(mapStateToProps, {})
)(InterestGroupList);
