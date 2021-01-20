// @flow
import { compose } from 'redux';
import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import { formValueSelector } from 'redux-form';
import { fetchGroup } from 'app/actions/GroupActions';
import { editInterestGroup } from 'app/actions/InterestGroupActions';
import { uploadFile } from 'app/actions/FileActions';
import { selectGroup } from 'app/reducers/groups';
import { LoginPage } from 'app/components/LoginForm';
import InterestGroupEdit from './components/InterestGroupEdit';
import loadingIndicator from 'app/utils/loadingIndicator';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

const mapDispatchToProps = {
  editInterestGroup,
  uploadFile,
  handleSubmitCallback: editInterestGroup,
};

const mapStateToProps = (state, props) => {
  const { interestGroupId } = props.match.params;
  const valueSelector = formValueSelector('interestGroupEditor');
  const interestGroup = selectGroup(state, { groupId: interestGroupId });

  return {
    interestGroup,
    initialValues: interestGroup,
    groupMembers: valueSelector(state, 'members') || [],
  };
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(({ match: { params: { interestGroupId } } }, dispatch) =>
    dispatch(fetchGroup(Number(interestGroupId)))
  ),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['interestGroup'])
)(InterestGroupEdit);
