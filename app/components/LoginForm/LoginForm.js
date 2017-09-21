// @flow

import React, { Component } from 'react';
import cx from 'classnames';
import { Form, Button, TextInput } from '../Form';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
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

class LoginForm extends Component {
  props: Props;
  login = ({ username, password }) => this.props.login(username, password);

  render() {
    const { invalid, submitting, handleSubmit } = this.props;
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
