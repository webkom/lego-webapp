import { Icon } from '@webkom/lego-bricks';
import { FORM_ERROR } from 'final-form';
import { LogIn } from 'lucide-react';
import { Field } from 'react-final-form';
import { Form } from '~/components/Form';
import LegoFinalForm from '~/components/Form/LegoFinalForm';
import SubmissionError from '~/components/Form/SubmissionError';
import { SubmitButton } from '~/components/Form/SubmitButton';
import TextInput from '~/components/Form/TextInput';
import { login } from '~/redux/actions/UserActions';
import { useAppDispatch } from '~/redux/hooks';
import { createValidator, required } from '~/utils/validation';

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
    } catch (_) {
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
