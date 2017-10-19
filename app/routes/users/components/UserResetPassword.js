// @flow
import React from 'react';
import { reduxForm, FormProps, Field } from 'redux-form';
import { Content } from 'app/components/Layout';
import { Form, Button, TextInput } from 'app/components/Form';
import { createValidator, required, validPassword } from 'app/utils/validation';

type Props = {
  token: string,
  resetPassword: ({ token: string, password: string }) => void
} & FormProps;

const UserResetPassword = ({
  token,
  invalid,
  pristine,
  submitting,
  handleSubmit,
  resetPassword,
  router
}: Props) => {
  const disabledButton = invalid | pristine | submitting;
  return (
    <Content>
      <h1>Tilbakestill Passord</h1>
      {token ? (
        <Form
          onSubmit={handleSubmit(props =>
            resetPassword({ token, ...props }).then(() => router.push('/'))
          )}
        >
          <Field
            label="Nytt passord"
            name="password"
            type="password"
            component={TextInput.Field}
          />
          <Button submit disabled={disabledButton}>
            Tilbakestill passord
          </Button>
        </Form>
      ) : (
        <p>No token...</p>
      )}
    </Content>
  );
};

const validate = createValidator({
  password: [required(), validPassword()]
});

export default reduxForm({
  form: 'ResetPassword',
  validate
})(UserResetPassword);
