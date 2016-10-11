// @flow

import React, { Component } from 'react';
import Button from 'app/components/Button';
import { Form, TextInput } from 'app/components/Form';
import { Field } from 'redux-form';

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
      onSubmit,
      invalid,
      pristine,
      submitting
    } = this.props;

    const disabledButton = invalid || pristine || submitting;

    return (
      <Form onSubmit={onSubmit}>
        <Field
          placeholder='Brukernavn'
          label='Username'
          name='username'
          readOnly
          component={TextInput.Field}
        />

        <Field
          placeholder='Fornavn'
          label='First name'
          name='firstName'
          component={TextInput.Field}
        />

        <Field
          placeholder='Etternavn'
          label='Last name'
          name='lastName'
          component={TextInput.Field}
        />

        <Field
          placeholder='abc@stud.ntnu.no'
          label='email'
          name='email'
          component={TextInput.Field}
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
