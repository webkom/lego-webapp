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

class LoginForm extends Component<Props> {
  usernameRef: Field;
  passwordRef: Field;

  componentDidMount() {
    // Trigger onChange of the fields in case the inputs
    // were initialized with data from e.g. a mobile phone's autofill:
    this.props.change('username', this.usernameRef.value);
    this.props.change('password', this.passwordRef.value);
  }

  login = values => {
    // Autofill in some mobile browsers doesn't trigger onChange,
    // so use the direct values if redux-form won't give us anything:
    const username = values.username || this.usernameRef.value;
    const password = values.password || this.passwordRef.value;
    return this.props.login(username, password).catch(err => {
      // Throw a SubmissionError to show validation errors with redux-form:
      if (err.payload.response.status === 400) {
        throw new SubmissionError({
          _error: 'Feil brukernavn eller passord'
        });
      }

      throw new SubmissionError({ _error: err.meta.errorMessage });
    });
  };

  render() {
    const { error, submitting, handleSubmit } = this.props;
    const style = { marginBottom: 10 };
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
          inputRef={node => {
            this.usernameRef = node;
          }}
          component={TextInput.Field}
        />
        <Field
          name="password"
          type="password"
          placeholder="Passord"
          fieldStyle={style}
          showErrors={false}
          inputRef={node => {
            this.passwordRef = node;
          }}
          component={TextInput.Field}
        />
        {error && <Error error={error} />}
        <Button submit dark disabled={submitting}>
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
