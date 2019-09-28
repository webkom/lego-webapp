// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import { createValidator, required } from 'app/utils/validation';
import { createOAuth2Application } from 'app/actions/OAuth2Actions';
import UserSettingsOAuth2Form from './components/UserSettingsOAuth2Form';
import { push } from 'connected-react-router';

const validate = createValidator({
  name: [required()],
  description: [required()],
  redirectUris: [required()]
});

const mapStateToProps = state => {
  return {
    create: true
  };
};

const mapDispatchToProps = { createOAuth2Application, push };

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  reduxForm({
    form: 'oauth2',
    validate
  })
)(UserSettingsOAuth2Form);
