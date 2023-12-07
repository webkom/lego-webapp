import { Field } from 'react-final-form';
import { Content } from 'app/components/Content';
import { TextInput } from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import { useUserContext } from 'app/routes/app/AppRoute';
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
  const { currentUser } = useUserContext();
  const user = {
    username: currentUser.username,
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
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
              <PasswordField label="Nytt passord" user={user} />
              <Field
                label="Nytt passord (gjenta)"
                autocomplete="new-password"
                name="retypeNewPassword"
                type="password"
                component={TextInput.Field}
              />

              <SubmitButton danger>Tilbakestill passord</SubmitButton>
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
