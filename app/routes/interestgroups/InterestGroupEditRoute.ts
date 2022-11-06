import { compose } from 'redux';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { fetchGroup, editGroup } from 'app/actions/GroupActions';
import { uploadFile } from 'app/actions/FileActions';
import { selectGroup } from 'app/store/slices/groupsSlice';
import { LoginPage } from 'app/components/LoginForm';
import InterestGroupEdit from './components/InterestGroupEdit';
import loadingIndicator from 'app/utils/loadingIndicator';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';

const mapDispatchToProps = {
  editGroup,
  uploadFile,
  handleSubmitCallback: editGroup,
};

const mapStateToProps = (state, props) => {
  const { interestGroupId } = props.match.params;
  const valueSelector = formValueSelector('interestGroupEditor');
  const interestGroup = selectGroup(state, {
    groupId: interestGroupId,
  });
  return {
    interestGroup,
    initialValues: interestGroup,
    groupMembers: valueSelector(state, 'members') || [],
  };
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  withPreparedDispatch('fetchInterestGroupEdit', (props, dispatch) =>
    dispatch(fetchGroup(Number(props.match.params.interestGroupId)))
  ),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['interestGroup'])
)(InterestGroupEdit);
