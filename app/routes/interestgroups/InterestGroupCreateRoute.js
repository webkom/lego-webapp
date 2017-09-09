// @flow
import { compose } from 'redux';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import {
  createInterestGroup,
  joinInterestGroup
} from 'app/actions/InterestGroupActions';
import InterestGroupCreate from './components/InterestGroupCreate';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { uploadFile } from 'app/actions/FileActions';

const mapDispatchToProps = {
  createInterestGroup,
  joinInterestGroup,
  uploadFile
};

const mapStateToProps = (state, props) => {
  const valueSelector = formValueSelector('interestGroupCreate');
  return {
    initialValues: {
      descriptionLong: '<p></p>'
    },
    invitedMembers: valueSelector(state, 'members') || []
  };
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  connect(mapStateToProps, mapDispatchToProps)
)(InterestGroupCreate);
