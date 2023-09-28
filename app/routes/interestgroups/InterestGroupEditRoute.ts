import { connect } from 'react-redux';
import { compose } from 'redux';
import { formValueSelector } from 'redux-form';
import { uploadFile } from 'app/actions/FileActions';
import { fetchGroup, editGroup } from 'app/actions/GroupActions';
import { LoginPage } from 'app/components/LoginForm';
import { selectGroup } from 'app/reducers/groups';
import loadingIndicator from 'app/utils/loadingIndicator';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import InterestGroupEdit from './components/InterestGroupEdit';

const mapDispatchToProps = {
  editGroup,
  uploadFile,
  handleSubmitCallback: editGroup,
};

const mapStateToProps = (state, props) => {
  const { groupId } = props.match.params;
  const valueSelector = formValueSelector('interestGroupEditor');
  const interestGroup = selectGroup(state, {
    groupId,
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
    dispatch(fetchGroup(Number(props.match.params.groupId)))
  ),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['interestGroup'])
)(InterestGroupEdit);
