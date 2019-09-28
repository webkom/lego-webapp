// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import prepare from 'app/utils/prepare';

import { createValidator, required } from 'app/utils/validation';
import UserSettingsOAuth2Form from './components/UserSettingsOAuth2Form';
import {
  fetchOAuth2Application,
  updateOAuth2Application
} from 'app/actions/OAuth2Actions';
import { selectOAuth2ApplicationById } from 'app/reducers/oauth2';
import { push } from 'connected-react-router';

const validate = createValidator({
  name: [required()],
  description: [required()],
  redirectUris: [required()]
});

const loadData = ({ match: { params } }, dispatch) => {
  return dispatch(fetchOAuth2Application(params.applicationId));
};

const mapStateToProps = (state, props) => {
  const { applicationId } = props.match.params;
  const application = selectOAuth2ApplicationById(state, { applicationId });
  return {
    initialValues: application,
    application
  };
};

const mapDispatchToProps = { updateOAuth2Application, push };

export default compose(
  prepare(loadData),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  reduxForm({
    form: 'oauth2',
    validate,
    enableReinitialize: true
  })
)(UserSettingsOAuth2Form);
