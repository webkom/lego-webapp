import { connect } from 'react-redux';
import { compose } from 'redux';
import { push } from 'redux-first-history';
import { reduxForm } from 'redux-form';

import {
  fetchOAuth2Application,
  updateOAuth2Application,
} from 'app/actions/OAuth2Actions';
import { selectOAuth2ApplicationById } from 'app/reducers/oauth2';
import { createValidator, required } from 'app/utils/validation';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import UserSettingsOAuth2Form from './components/UserSettingsOAuth2Form';

const validate = createValidator({
  name: [required()],
  description: [required()],
  redirectUris: [required()],
});

const mapStateToProps = (state, props) => {
  const { applicationId } = props.match.params;
  const application = selectOAuth2ApplicationById(state, {
    applicationId,
  });
  return {
    initialValues: application,
    application,
  };
};

const mapDispatchToProps = {
  updateOAuth2Application,
  push,
};
export default compose(
  withPreparedDispatch('fetchUserSettingsOAuth2Edit', (props, dispatch) =>
    dispatch(fetchOAuth2Application(props.match.params.applicationId))
  ),
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'oauth2',
    validate,
    enableReinitialize: true,
  })
)(UserSettingsOAuth2Form);
