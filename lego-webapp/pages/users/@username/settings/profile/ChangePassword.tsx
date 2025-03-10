import { Field } from 'react-final-form';
import { navigate } from 'vike/client/router';
import {
  Form,
  TextInput,
  LegoFinalForm,
  SubmitButton,
} from '~/components/Form';
import { validPassword } from '~/pages/users/utils';
import { changePassword } from '~/redux/actions/UserActions';
import { useAppDispatch } from '~/redux/hooks';
import { useCurrentUser } from '~/redux/slices/auth';
import { createValidator, required, sameAs } from '~/utils/validation';
import PasswordField from '../../../_components/PasswordField';

export type FormValues = {
  password: string;
  newPassword: string;
  retypeNewPassword: string;
};

const TypedLegoForm = LegoFinalForm<FormValues>;

const ChangePasswordForm = () => {
  const dispatch = useAppDispatch();

  const onSubmit = (data: FormValues) =>
    dispatch(changePassword(data)).then(() => {
      navigate('/users/me');
    });

  const currentUser = useCurrentUser();

  return (
    <TypedLegoForm onSubmit={onSubmit} validate={validate}>
      {({ handleSubmit, valid }) => (
        <Form onSubmit={handleSubmit}>
          <Field
            label="Nåværende passord"
            name="password"
            type="password"
            placeholder="passord123"
            autocomplete="current-password"
            component={TextInput.Field}
          />
          <PasswordField
            user={currentUser}
            label="Nytt passord"
            placeholder="passord123!"
            name="newPassword"
          />
          <Field
            label="Gjenta nytt passord"
            name="retypeNewPassword"
            autocomplete="new-password"
            type="password"
            component={TextInput.Field}
          />
          <SubmitButton disabled={!valid} danger>
            Endre passord
          </SubmitButton>
        </Form>
      )}
    </TypedLegoForm>
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
  true,
);

export default ChangePasswordForm;
