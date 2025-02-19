import { Icon } from '@webkom/lego-bricks';
import { FORM_ERROR } from 'final-form';
import { LogIn } from 'lucide-react';
import { Field } from 'react-final-form';
import { login } from 'app/actions/UserActions';
import { Form } from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import SubmissionError from 'app/components/Form/SubmissionError';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import TextInput from 'app/components/Form/TextInput';
import { useAppDispatch } from 'app/store/hooks';
import { createValidator, required } from 'app/utils/validation';

type FormValues = {
  username: string;
  password: string;
};

const validate = createValidator({
  username: [required()],
  password: [required()],
});

const LoginForm = () => {
  const dispatch = useAppDispatch();

  const onSubmit = async (values: FormValues) => {
    try {
      await dispatch(login(values.username, values.password));
    } catch (error) {
      return { [FORM_ERROR]: 'Feil brukernavn eller passord' };
    }
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <LegoFinalForm onSubmit={onSubmit} validate={validate} subscription={{}}>
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
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
            <SubmitButton>
              <Icon iconNode={<LogIn />} size={19} /> Logg inn
            </SubmitButton>
          </Form>
        )}
      </LegoFinalForm>
    </div>
  );
};

export default LoginForm;
