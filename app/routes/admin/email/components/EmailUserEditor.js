//@flow

import React from 'react';
import Button from 'app/components/Button';
import { createValidator, required } from 'app/utils/validation';
import { reduxForm } from 'redux-form';
import { TextInput, SelectInput, CheckBox } from 'app/components/Form';
import { Form, Field } from 'redux-form';

export type Props = {
  emailUserId?: number,
  submitting: boolean,
  handleSubmit: Function => void,
  push: string => void,
  mutateFunction: Object => Promise<*>
};

const EmailUserEditor = ({
  emailUserId,
  mutateFunction,
  submitting,
  push,
  handleSubmit
}: Props) => {
  const onSubmit = data => {
    mutateFunction({
      ...data,
      user: data.user.value,
      internalEmailEnabled: !!data.internalEmailEnabled
    }).then(({ payload }) => {
      if (!emailUserId) {
        push(`/admin/email/users/${payload.result}`);
      }
    });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Field
        label="Bruker"
        name="user"
        required
        disabled={emailUserId}
        placeholder="Velg bruker"
        filter={['users.user']}
        component={SelectInput.AutocompleteField}
      />
      <Field
        required
        disabled={emailUserId}
        placeholder="abakus"
        suffix="@abakus.no"
        name="internalEmail"
        label="Gsuite Epost"
        component={TextInput.Field}
      />
      <Field
        label="Intern epost aktivert"
        name="internalEmailEnabled"
        component={CheckBox.Field}
        normalize={v => !!v}
      />
      <Button submit disabled={submitting}>
        {emailUserId ? 'Oppdater epostbruker' : 'Lag epostbruker'}
      </Button>
    </Form>
  );
};

export default reduxForm({
  form: 'emailUser',
  enableReinitialize: true,
  validate: createValidator({
    email: [required()],
    name: [required()]
  })
})(EmailUserEditor);
