import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { createOAuth2Application } from 'app/actions/OAuth2Actions';
import { createValidator, required } from 'app/utils/validation';
import UserSettingsOAuth2Form from './components/UserSettingsOAuth2Form';

const validate = createValidator({
  name: [required()],
  description: [required()],
  redirectUris: [required()],
});

const mapStateToProps = () => {
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
