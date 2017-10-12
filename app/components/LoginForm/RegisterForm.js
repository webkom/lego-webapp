import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { sendRegistrationEmail } from 'app/actions/UserActions';
import { Form, TextInput, Captcha } from '../Form';
import Button from '../Button';
import { createValidator, required, isEmail } from 'app/utils/validation';

type Props = {
  login: (username: string, password: string) => any
};

class RegisterForm extends Component {
  props: Props;

  mounted = false;
  state = {
    submitted: false
  };

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onSubmit = data => {
    return this.props
      .sendRegistrationEmail(data)
      .then(() => {
        if (this.mounted) {
          this.setState({
            submitted: true
          });
        }
      })
      .catch(err => {
        if (this.mounted && err.payload && err.payload.response) {
          throw new SubmissionError(err.payload.response.jsonData);
        }
      });
  };

  render() {
    const { handleSubmit, invalid, pristine, submitting } = this.props;

    if (this.state.submitted) {
      return <div>Sjekk eposten din</div>;
    }
    return (
      <Form onSubmit={handleSubmit(this.onSubmit)}>
        <Field name="email" component={TextInput.Field} placeholder="E-post" />
        <Field
          name="captchaResponse"
          fieldStyle={{ width: 304 }}
          component={Captcha.Field}
        />
        <Button submit disabled={invalid | pristine | submitting} dark>
          Registrer deg
        </Button>
      </Form>
    );
  }
}

const validate = createValidator({
  email: [required(), isEmail()],
  captchaResponse: [required('Captcha er ikke validert')]
});

export default compose(
  connect(null, { sendRegistrationEmail }),
  reduxForm({ form: 'RegisterForm', validate })
)(RegisterForm);
