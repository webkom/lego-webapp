import { reduxForm, Field } from 'redux-form';
import { Content } from 'app/components/Content';
import { Form, Button, TextInput } from 'app/components/Form';
import type { Action } from 'app/types';
import { createAsyncValidator } from 'app/utils/asyncValidator';
import { createValidator, required, sameAs } from 'app/utils/validation';
import { validPassword } from '../utils';
import PasswordField from './PasswordField';
import type { FormProps } from 'react-redux';

type Props = {
  token: string;
  resetPassword: (arg0: { token: string; password: string }) => Promise<any>;
  push: (location: string) => Action;
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
      <h1>Tilbakestill passord</h1>
      {token ? (
        <Form
          onSubmit={handleSubmit((props) =>
            resetPassword({
              token,
              ...props,
            }).then(() => push('/'))
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
          <Button danger submit disabled={disabledButton}>
            Tilbakestill passord
          </Button>
        </Form>
      ) : (
        <p>Ingen token ...</p>
      )}
    </Content>
  );
};

const validate = createValidator({
  password: [required()],
  retypeNewPassword: [
    required(),
    sameAs('password', 'Passordene er ikke like'),
  ],
});
const asyncValidate = createAsyncValidator({
  password: [validPassword()],
});
export default reduxForm({
  form: 'ResetPassword',
  validate,
  asyncValidate,
})(UserResetPassword);
