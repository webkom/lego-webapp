import { compose } from "redux";
import { connect } from "react-redux";
import prepare from "app/utils/prepare";
import { fetchAllWithType } from "app/actions/GroupActions";
import InterestGroupList from "./components/InterestGroupList";
import { selectGroupsWithType } from "app/reducers/groups";
import { GroupTypeInterest } from "app/models";
import { LoginPage } from "app/components/LoginForm";
import replaceUnlessLoggedIn from "app/utils/replaceUnlessLoggedIn";
const groupType = GroupTypeInterest;

const mapStateToProps = state => ({
  interestGroups: selectGroupsWithType(state, {
    groupType
  }),
  actionGrant: state.groups.actionGrant
});

export default compose(replaceUnlessLoggedIn(LoginPage), prepare((props, dispatch) => dispatch(fetchAllWithType(groupType))), connect(mapStateToProps, {}))(InterestGroupList);