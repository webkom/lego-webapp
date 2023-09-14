import { connect } from 'react-redux';
import { compose } from 'redux';
import { push } from 'redux-first-history';
import { reduxForm } from 'redux-form';
import { createOAuth2Application } from 'app/actions/OAuth2Actions';
import { createValidator, required } from 'app/utils/validation';
import UserSettingsOAuth2Form from './components/UserSettingsOAuth2Form';

const validate = createValidator({
  name: [required()],
  description: [required()],
  redirectUris: [required()],
});

const mapStateToProps = (state) => {
  return {
    create: true,
  };
};

const mapDispatchToProps = {
  createOAuth2Application,
  push,
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'oauth2',
    validate,
  })
)(UserSettingsOAuth2Form);
