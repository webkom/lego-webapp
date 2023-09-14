import { Field } from 'react-final-form';
import { Content } from 'app/components/Content';
import { Button, TextInput } from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import { spySubmittable } from 'app/utils/formSpyUtils';
import { createValidator, required, sameAs } from 'app/utils/validation';
import { validPassword } from '../utils';
import PasswordField from './PasswordField';
import type { History } from 'history';

type Props = {
  token?: string;
  resetPassword: (arg0: { token: string; password: string }) => Promise<any>;
  push: History['push'];
};

const UserResetPasswordForm = ({ token, resetPassword, push }: Props) => {
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

  const onSubmit = (props) =>
    resetPassword({
      token,
      ...props,
    }).then(() => push('/'));

  return (
    <Content>
      <h1>Tilbakestill passord</h1>
      {token ? (
        <LegoFinalForm onSubmit={onSubmit} validate={validate}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <PasswordField label="Nytt passord" user={dummyUser} />
              <Field
                label="Nytt passord (gjenta)"
                autocomplete="new-password"
                name="retypeNewPassword"
                type="password"
                component={TextInput.Field}
              />

              {spySubmittable((submittable) => (
                <Button danger submit disabled={!submittable}>
                  Tilbakestill passord
                </Button>
              ))}
            </form>
          )}
        </LegoFinalForm>
      ) : (
        <p>Ingen token ...</p>
      )}
    </Content>
  );
};

const validate = createValidator(
  {
    password: [required(), validPassword()],
    retypeNewPassword: [
      required(),
      sameAs('password', 'Passordene er ikke like'),
    ],
  },
  undefined,
  true
);

export default UserResetPasswordForm;
