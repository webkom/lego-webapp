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
import styles from './LoginForm.module.css';
import type { ReactNode } from 'react';

type FormValues = {
  username: string;
  password: string;
};

type Props = {
  /** Rendered right below the password field, e.g. a "Glemt passord?" link */
  afterFields?: ReactNode;
  /** Rendered beside the submit button, which then splits the row in two */
  secondaryAction?: ReactNode;
};

const validate = createValidator({
  username: [required()],
  password: [required()],
});

const LoginForm = ({ afterFields, secondaryAction }: Props) => {
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
        {({ handleSubmit }) => {
          const submitButton = (
            <SubmitButton>
              <Icon iconNode={<LogIn />} size={19} /> Logg inn
            </SubmitButton>
          );
          return (
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

              {afterFields}
              <SubmissionError />
              {secondaryAction ? (
                <div className={styles.actions}>
                  {submitButton}
                  {secondaryAction}
                </div>
              ) : (
                submitButton
              )}
            </Form>
          );
        }}
      </LegoFinalForm>
    </div>
  );
};

export default LoginForm;
