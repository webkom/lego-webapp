import { Field } from 'redux-form';
import Button from 'app/components/Button';
import { TextInput, Form, legoForm } from 'app/components/Form';
import type { UserEntity } from 'app/reducers/users';
import { createAsyncValidator } from 'app/utils/asyncValidator';
import { createValidator, required, sameAs } from 'app/utils/validation';
import { validPassword } from '../utils';
import PasswordField from './PasswordField';
import type { FormProps } from 'redux-form';

type PasswordPayload = {
  newPassword: string;
  password: string;
  retype_new_password: string;
};
type Props = FormProps & {
  push: (arg0: string) => void;
  changePassword: (arg0: PasswordPayload) => Promise<void>;
  user: UserEntity;
};

const ChangePassword = ({
  handleSubmit,
  invalid,
  pristine,
  submitting,
  user,
  ...props
}: Props) => {
  const disabledButton = invalid || pristine || submitting;
  return (
    <Form onSubmit={handleSubmit}>
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
      <Button disabled={disabledButton} submit danger>
        Endre passord
      </Button>
    </Form>
  );
};

const validate = createValidator({
  password: [required()],
  newPassword: [required()],
  retypeNewPassword: [
    required(),
    sameAs('newPassword', 'Passordene er ikke like'),
  ],
});
const asyncValidate = createAsyncValidator({
  newPassword: [validPassword()],
});
export default legoForm({
  form: 'changePassword',
  validate,
  asyncValidate,
  onSubmit: (data, dispatch, { changePassword, push }: Props) =>
    changePassword(data).then(() => push('/users/me')),
})(ChangePassword);
