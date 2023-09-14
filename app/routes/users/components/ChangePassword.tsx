import { Button } from '@webkom/lego-bricks';
import { Field, FormSpy } from 'react-final-form';
import { TextInput } from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import { createValidator, required, sameAs } from 'app/utils/validation';
import { validPassword } from '../utils';
import PasswordField from './PasswordField';
import type { UserEntity } from 'app/reducers/users';
import type { History } from 'history';

type PasswordPayload = {
  newPassword: string;
  password: string;
  retype_new_password: string;
};
type Props = {
  push: History['push'];
  changePassword: (arg0: PasswordPayload) => Promise<void>;
  user: UserEntity;
};

const ChangePasswordForm = ({ user, changePassword, push }: Props) => {
  const onSubmit = (data: PasswordPayload) =>
    changePassword(data).then(() => push('/users/me'));
  return (
    <LegoFinalForm onSubmit={onSubmit} validate={validate}>
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Field
            label="Gammelt passord"
            name="password"
            type="password"
            autocomplete="current-password"
            component={TextInput.Field}
          />
          <PasswordField user={user} label="Nytt passord" name="newPassword" />
          <Field
            label="Nytt passord (gjenta)"
            name="retypeNewPassword"
            autocomplete="new-password"
            type="password"
            component={TextInput.Field}
          />
          <FormSpy
            subscription={{
              pristine: true,
              submitting: true,
              invalid: true,
            }}
          >
            {({ pristine, submitting, invalid }) => (
              <Button
                submit
                danger
                disabled={pristine || submitting || invalid}
              >
                Endre passord
              </Button>
            )}
          </FormSpy>
        </form>
      )}
    </LegoFinalForm>
  );
};

const validate = createValidator(
  {
    password: [required()],
    newPassword: [required(), validPassword()],
    retypeNewPassword: [
      required(),
      sameAs('newPassword', 'Passordene er ikke like'),
    ],
  },
  undefined,
  true
);

export default ChangePasswordForm;
