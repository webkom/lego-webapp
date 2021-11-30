// @flow
import type { FormProps } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { Content } from 'app/components/Content';
import type { Action } from 'app/types';
import { Form, Button, TextInput } from 'app/components/Form';
import { createValidator, required, sameAs } from 'app/utils/validation';
import { validPassword } from '../utils';
import PasswordField from './PasswordField';

type Props = {
  token: string,
  resetPassword: ({ token: string, password: string }) => Promise<*>,
  push: (location: string) => Action,
} & FormProps;

const UserResetPassword = ({
  token,
  invalid,
  pristine,
  submitting,
  handleSubmit,
  resetPassword,
  push,
}: Props) => {
  const disabledButton = invalid || pristine || submitting;
  const dummyUser = {
    id: 0,
    username: '',
    fullName: '',
    firstName: '',
    lastName: '',
    gender: '',
    profilePicture: '',
    selectedTheme: '',
  };
  return (
    <Content>
      <h1>Tilbakestill Passord</h1>
      {token ? (
        <Form
          onSubmit={handleSubmit((props) =>
            resetPassword({ token, ...props }).then(() => push('/'))
          )}
        >
          <PasswordField label="Nytt passord" user={dummyUser} />
          <Field
            label="Nytt passord (gjenta)"
            autocomplete="new-password"
            name="retypeNewPassword"
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
  password: [required(), validPassword()],
  retypeNewPassword: [
    required(),
    sameAs('password', 'Passordene er ikke like'),
  ],
});

export default reduxForm({
  form: 'ResetPassword',
  validate,
})(UserResetPassword);
