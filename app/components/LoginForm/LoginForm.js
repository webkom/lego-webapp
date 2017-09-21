// @flow

import React, { Component } from 'react';
import cx from 'classnames';
import { Form, Button, TextInput } from '../Form';
import { connect } from 'react-redux';
import { SubmissionError, Field, reduxForm } from 'redux-form';
import type { FieldProps } from 'redux-form';
import { login } from 'app/actions/UserActions';
import { createValidator, required } from 'app/utils/validation';

type ConnectedProps = {
  login: (username: string, password: string) => Promise<void>
};

type OwnProps = {
  className?: string
};

type Props = ConnectedProps & OwnProps & FieldProps;

type ErrorProps = { error: string };

const Error = ({ error }: ErrorProps) => (
  <p style={{ color: '#c24538' }}>{error}</p>
);

class LoginForm extends Component {
  props: Props;
  login = ({ username, password }) =>
    this.props.login(username, password).catch(err => {
      // Throw a SubmissionError to show validation errors with redux-form:
      if (err.payload.response.status === 400) {
        throw new SubmissionError({
          _error: 'Feil brukernavn eller passord'
        });
      }

      throw new SubmissionError({ _error: err.meta.errorMessage });
    });

  render() {
    const { error, invalid, submitting, handleSubmit } = this.props;
    const style = { marginBottom: 10 };
    const disabled = invalid || submitting;
    return (
      <Form
        onSubmit={handleSubmit(this.login)}
        className={cx(this.props.className)}
      >
        <Field
          name="username"
          placeholder="Brukernavn"
          fieldStyle={style}
          showErrors={false}
          component={TextInput.Field}
        />
        <Field
          name="password"
          type="password"
          placeholder="Passord"
          fieldStyle={style}
          showErrors={false}
          component={TextInput.Field}
        />
        {error && <Error error={error} />}
        <Button submit dark disabled={disabled}>
          Logg inn
        </Button>
      </Form>
    );
  }
}

const validate = createValidator({
  username: [required()],
  password: [required()]
});

export default reduxForm({ validate, form: 'LoginForm' })(
  connect(null, { login })(LoginForm)
);
