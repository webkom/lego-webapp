// @flow

import React from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import type { FieldProps } from 'redux-form';
import Button from 'app/components/Button';
import { TextInput, Form } from 'app/components/Form';
import {
  createValidator,
  required,
  validPassword,
  sameAs
} from 'app/utils/validation';

type Props = FieldProps & {
  push: string => void,
  changePassword: Object => Promise<void>
};

const ChangePassword = ({
  handleSubmit,
  invalid,
  pristine,
  submitting,
  changePassword,
  push,
  ...props
}: Props) => {
  const disabledButton = invalid || pristine || submitting;
  const onSubmit = data =>
    changePassword(data)
      .then(() => push('/users/me'))
      .catch(err => {
        if (err.payload && err.payload.response) {
          throw new SubmissionError(err.payload.response.jsonData);
        }
      });

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
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

export default reduxForm({
  form: 'changePassword',
  validate
})(ChangePassword);
