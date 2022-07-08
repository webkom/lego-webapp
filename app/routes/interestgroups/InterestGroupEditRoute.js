// @flow
import { connect } from 'react-redux';
import { compose } from 'redux';
import { formValueSelector } from 'redux-form';

import { uploadFile } from 'app/actions/FileActions';
import { editGroup, fetchGroup } from 'app/actions/GroupActions';
import { LoginPage } from 'app/components/LoginForm';
import { selectGroup } from 'app/reducers/groups';
import loadingIndicator from 'app/utils/loadingIndicator';
import prepare from 'app/utils/prepare';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import InterestGroupEdit from './components/InterestGroupEdit';

const mapDispatchToProps = {
  editGroup,
  uploadFile,
  handleSubmitCallback: editGroup,
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
  prepare(
    (
      {
        match: {
          params: { interestGroupId },
        },
      },
      dispatch
    ) => dispatch(fetchGroup(Number(interestGroupId)))
  ),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['interestGroup'])
)(InterestGroupEdit);
