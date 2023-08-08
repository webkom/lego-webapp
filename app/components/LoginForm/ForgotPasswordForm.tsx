import { Button } from '@webkom/lego-bricks';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { sendForgotPasswordEmail } from 'app/actions/UserActions';
import { createValidator, required, isEmail } from 'app/utils/validation';
import { Form, TextInput } from '../Form';
import type { FormProps } from 'redux-form';

type Props = {
  sendForgotPasswordEmail: (arg0: { email: string }) => any;
} & FormProps;
type State = {
  submitted: boolean;
};

class ForgotPasswordForm extends Component<Props, State> {
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
      .sendForgotPasswordEmail(data)
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
          Vi har sendt en e-post til deg med informasjon om hvordan du kan
          tilbakestille passordet.
        </div>
      );
    }

    return (
      <Form
        onSubmit={handleSubmit(this.onSubmit)}
        onClick={(e) => e.stopPropagation()}
      >
        <Field name="email" component={TextInput.Field} placeholder="E-post" />
        <Button danger submit disabled={invalid || pristine || submitting}>
          Tilbakestill passord
        </Button>
      </Form>
    );
  }
}

const validate = createValidator({
  email: [required(), isEmail()],
});
export default compose(
  connect<any, any, any, any, any, any>(null, {
    sendForgotPasswordEmail,
  }),
  reduxForm({
    form: 'ForgotPasswordForm',
    validate,
  })
)(ForgotPasswordForm);
