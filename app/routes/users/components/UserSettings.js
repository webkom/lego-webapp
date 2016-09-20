// @flow

import React, { Component } from 'react';
import Button from 'app/components/Button';
import { Form, Field } from 'app/components/Form';

type Props = {
  fields: Object,
  onSubmit: () => void,
  invalid: boolean,
  pristine: boolean,
  submitting: boolean
};

export default class UserSettings extends Component {
  props: Props;

  render() {
    const {
      fields: {
        username, firstName, lastName, email
      },
      onSubmit,
      invalid,
      pristine,
      submitting
    } = this.props;

    const disabledButton = invalid || pristine || submitting;

    return (
      <Form onSubmit={onSubmit}>
        <Field
          label='Username'
          field={username}
          readOnly
        />

        <Field
          label='First name'
          field={firstName}
        />

        <Field
          label='Last name'
          field={lastName}
        />

        <Field
          label='Email'
          field={email}
          placeholder='abc@stud.ntnu.no'
        />

        <Button
          onClick={onSubmit}
          disabled={disabledButton}
          submit
        >
          Submit
        </Button>
      </Form>
    );
  }
}
