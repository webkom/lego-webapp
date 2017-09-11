// @flow
import { compose } from 'redux';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import {
  createInterestGroup,
  joinInterestGroup
} from 'app/actions/InterestGroupActions';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import InterestGroupEditor from './components/InterestGroupEditor';
import { uploadFile } from 'app/actions/FileActions';

const mapDispatchToProps = {
  createInterestGroup,
  joinInterestGroup,
  uploadFile,
  handleSubmitCallback: createInterestGroup
};

const mapStateToProps = (state, props) => {
  const valueSelector = formValueSelector('interestGroupEditor');
  return {
    initialValues: {
      descriptionLong: '<p></p>'
    },
    groupMembers: valueSelector(state, 'members') || []
  };
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  connect(mapStateToProps, mapDispatchToProps)
)(InterestGroupEditor);
