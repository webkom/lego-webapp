import cx from 'classnames';
import { Field } from 'react-final-form';
import { login } from 'app/actions/UserActions';
import Button from 'app/components/Button';
// import Form from 'app/components/Form/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import TextInput from 'app/components/Form/TextInput';
import { useAppDispatch } from 'app/store/hooks';
import { spySubmittable } from 'app/utils/formSpyUtils';
import { createValidator, required } from 'app/utils/validation';

type FormValues = {
  username: string;
  password: string;
};

type ConnectedProps = {
  login: (FormValues) => Promise<void>;
};
type OwnProps = {
  className?: string;

  // TODO: add this with eik's error util wrapper thingy
  // postLoginFail?: (arg0: any) => any;
  // postLoginSuccess?: (arg0: any) => any;
};
type Props = ConnectedProps & OwnProps;

const validate = createValidator({
  username: [required()],
  password: [required()],
});

const LoginForm = (props: Props) => {
  const dispatch = useAppDispatch();

  const onSubmit = async (values: FormValues) =>
    await dispatch(login(values.username, values.password));

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <LegoFinalForm onSubmit={onSubmit} validate={validate} subscription={{}}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className={props.className}>
            <Field
              name="username"
              placeholder="Brukernavn"
              showErrors={false}
              autoComplete="username"
              component={TextInput.Field}
            />

            <Field
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Passord"
              showErrors={false}
              component={TextInput.Field}
            />

            {spySubmittable((submittable) => (
              <Button dark submit disabled={!submittable}>
                Logg inn
              </Button>
            ))}
          </form>
        )}
      </LegoFinalForm>
    </div>
  );
};

export default LoginForm;
