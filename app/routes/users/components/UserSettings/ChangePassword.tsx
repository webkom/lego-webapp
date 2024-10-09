import { Field } from 'react-final-form';
import { useNavigate } from 'react-router-dom';
import { changePassword } from 'app/actions/UserActions';
import { TextInput } from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import { useCurrentUser } from 'app/reducers/auth';
import { validPassword } from 'app/routes/users/utils';
import { useAppDispatch } from 'app/store/hooks';
import { createValidator, required, sameAs } from 'app/utils/validation';
import PasswordField from '../PasswordField';

export type FormValues = {
  password: string;
  newPassword: string;
  retypeNewPassword: string;
};

const TypedLegoForm = LegoFinalForm<FormValues>;

const ChangePasswordForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit = (data: FormValues) =>
    dispatch(changePassword(data)).then(() => {
      navigate('/users/me');
    });

  const currentUser = useCurrentUser();

  return (
    <TypedLegoForm onSubmit={onSubmit} validate={validate}>
      {({ handleSubmit, valid }) => (
        <form onSubmit={handleSubmit}>
          <Field
            label="Gammelt passord"
            name="password"
            type="password"
            autocomplete="current-password"
            component={TextInput.Field}
          />
          <PasswordField
            user={currentUser}
            label="Nytt passord"
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
        </form>
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
