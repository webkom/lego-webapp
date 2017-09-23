// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, reset, change } from 'redux-form';

import { createValidator, required, maxLength } from 'app/utils/validation';
import { sendContactMessage } from 'app/actions/ContactActions';
import { addNotification } from 'app/actions/NotificationActions';
import Contact from './components/Contact';
import { selectIsLoggedIn } from 'app/reducers/auth';

const validate = createValidator({
  title: [required(), maxLength(80)],
  message: [required()],
  captchaResponse: [required('Captcha er ikke validert')]
});

const mapStateToProps = (state: Object) => ({
  loggedIn: selectIsLoggedIn(state)
});

const mapDispatchToProps = {
  sendContactMessage,
  addNotification,
  reset,
  change
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'contactForm',
    validate,
    enableReinitialize: true
  })
)(Contact);
