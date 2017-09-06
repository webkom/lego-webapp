import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { sendRegistrationEmail } from 'app/actions/UserActions';
import { Form, TextInput, Captcha } from '../Form';
import Button from '../Button';

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
    this.props.sendRegistrationEmail(data).then(() => {
      if (this.mounted) {
        this.setState({
          submitted: true
        });
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

const validate = data => {
  const errors = {};

  if (!data.email) {
    errors.email = 'Ingen epost';
  }

  if (!data.captchaResponse) {
    errors.captchaResponse = 'Captcha er ikke validert';
  }

  return errors;
};

export default compose(
  connect(null, { sendRegistrationEmail }),
  reduxForm({ form: 'RegisterForm', validate })
)(RegisterForm);
