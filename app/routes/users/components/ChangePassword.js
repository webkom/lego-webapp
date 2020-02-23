// @flow

import React from 'react';
import { Field } from 'redux-form';
import type { FormProps } from 'redux-form';
import Button from 'app/components/Button';
import { TextInput, Form, legoForm } from 'app/components/Form';
import {
  createValidator,
  required,
  validPassword,
  sameAs
} from 'app/utils/validation';

type Props = FormProps & {
  push: string => void,
  changePassword: Object => Promise<void>
};

const ChangePassword = ({
  handleSubmit,
  invalid,
  pristine,
  submitting,
  ...props
}: Props) => {
  const disabledButton = invalid || pristine || submitting;

  return (
    <Form onSubmit={handleSubmit}>
      <Field
        label="Gammelt passord"
        name="password"
        type="password"
        component={TextInput.Field}
      />
      <Field
        label="Nytt passord"
        name="newPassword"
        type="password"
        component={TextInput.Field}
      />
      <Field
        label="Nytt passord (gjenta)"
        name="retypeNewPassword"
        type="password"
        component={TextInput.Field}
      />
      <Button disabled={disabledButton} submit>
        Change Password
      </Button>
    </Form>
  );
};

const validate = createValidator({
  password: [required()],
  newPassword: [required(), validPassword()],
  retypeNewPassword: [
    required(),
    sameAs('newPassword', 'Passordene er ikke like')
  ]
});

export default legoForm({
  form: 'changePassword',
  validate,
  onSubmit: (data, dispatch, { changePassword, push }: Props) =>
    changePassword(data).then(() => push('/users/me'))
})(ChangePassword);
