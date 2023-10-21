import { FORM_ERROR } from 'final-form';
import { Field } from 'react-final-form';
import { login } from 'app/actions/UserActions';
import { Form } from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import SubmissionError from 'app/components/Form/SubmissionError';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import TextInput from 'app/components/Form/TextInput';
import { useAppDispatch } from 'app/store/hooks';
import type { Action } from 'app/types';
import { createValidator, required } from 'app/utils/validation';

type FormValues = {
  username: string;
  password: string;
};

type Props = {
  className?: string;
  postLoginFail?: (error: unknown) => void;
  postLoginSuccess?: (res: Action) => any;
};

const validate = createValidator({
  username: [required()],
  password: [required()],
});

const LoginForm = (props: Props) => {
  const dispatch = useAppDispatch();

  const {
    postLoginSuccess = (res) => res,
    postLoginFail = (error) => {
      console.error(error);
    },
  } = props;

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await dispatch(login(values.username, values.password));
      return postLoginSuccess(res);
    } catch (error) {
      postLoginFail(error);
      return { [FORM_ERROR]: 'Feil brukernavn eller passord' };
    }
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <LegoFinalForm onSubmit={onSubmit} validate={validate} subscription={{}}>
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit} className={props.className}>
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

            <SubmissionError />
            <SubmitButton>Logg inn</SubmitButton>
          </Form>
        )}
      </LegoFinalForm>
    </div>
  );
};

export default LoginForm;
