import { Button } from '@webkom/lego-bricks';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { sendRegistrationEmail } from 'app/actions/UserActions';
import { createValidator, required, isEmail } from 'app/utils/validation';
import { Form, TextInput, Captcha } from '../Form';
import type { FormProps } from 'redux-form';

type Props = {
  sendRegistrationEmail: (arg0: {
    email: string;
    captchaResponse: string;
  }) => any;
} & FormProps;
type State = {
  submitted: boolean;
};

class RegisterForm extends Component<Props, State> {
  mounted = false;
  state = {
    submitted: false,
  };

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onSubmit = (data) => {
    return this.props
      .sendRegistrationEmail(data)
      .then(() => {
        if (this.mounted) {
          this.setState({
            submitted: true,
          });
        }
      })
      .catch((err) => {
        if (this.mounted && err.payload && err.payload.response) {
          throw new SubmissionError(err.payload.response.jsonData);
        }
      });
  };

  render() {
    const { handleSubmit, invalid, pristine, submitting } = this.props;

    if (this.state.submitted) {
      return (
        <div>
          Vi har sendt en e-post til deg hvor du kan fortsette registreringen.
        </div>
      );
    }

    return (
      <Form
        onSubmit={handleSubmit(this.onSubmit)}
        onClick={(e) => e.stopPropagation()}
      >
        <Field name="email" component={TextInput.Field} placeholder="E-post" />
        <Field
          name="captchaResponse"
          fieldStyle={{
            width: 304,
          }}
          component={Captcha.Field}
        />
        <Button dark submit disabled={invalid || pristine || submitting}>
          Registrer deg
        </Button>
      </Form>
    );
  }
}

const validate = createValidator({
  email: [required(), isEmail()],
  captchaResponse: [required('Captcha er ikke validert')],
});
export default compose(
  connect<any, any, any, any, any, any>(null, {
    sendRegistrationEmail,
  }),
  reduxForm({
    form: 'RegisterForm',
    validate,
  }),
)(RegisterForm);
