// @flow

import React, { Component } from 'react';
import Button from 'app/components/Button';
import { Form } from 'app/components/Form';
import { Field } from 'redux-form';
import FieldWrapper from 'app/components/Form/FieldWrapper';


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
          component={FieldWrapper}
        />

        <Field
          placeholder='Fornavn'
          label='First name'
          name='firstName'
          component={FieldWrapper}
        />

        <Field
          placeholder='Etternavn'
          label='Last name'
          name='lastName'
          component={FieldWrapper}
        />

        <Field
          placeholder='abc@stud.ntnu.no'
          label='email'
          name='email'
          component={FieldWrapper}
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
