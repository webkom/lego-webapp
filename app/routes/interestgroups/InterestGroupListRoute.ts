import { connect } from 'react-redux';
import { compose } from 'redux';
import { fetchAllWithType } from 'app/actions/GroupActions';
import { LoginPage } from 'app/components/LoginForm';
import { GroupType } from 'app/models';
import { selectGroupsWithType } from 'app/reducers/groups';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import InterestGroupList from './components/InterestGroupList';

const groupType = GroupType.Interest;

const mapStateToProps = (state) => ({
  interestGroups: selectGroupsWithType(state, {
    groupType,
  }),
  actionGrant: state.groups.actionGrant,
});

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  withPreparedDispatch('fetchInterestGroupList', (props, dispatch) =>
    dispatch(fetchAllWithType(groupType)),
  ),
  connect(mapStateToProps, {}),
)(InterestGroupList);
