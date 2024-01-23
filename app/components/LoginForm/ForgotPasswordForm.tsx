import { useEffect, useState } from 'react';
import { Field } from 'react-final-form';
import { sendForgotPasswordEmail } from 'app/actions/UserActions';
import { useAppDispatch } from 'app/store/hooks';
import { createValidator, required, isEmail } from 'app/utils/validation';
import { Form, LegoFinalForm, SubmitButton, TextInput } from '../Form';

const validate = createValidator({
  email: [required(), isEmail()],
});

const ForgotPasswordForm = () => {
  const [mounted, setMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const dispatch = useAppDispatch();

  const onSubmit = (data) => {
    dispatch(sendForgotPasswordEmail(data)).then(() => {
      if (mounted) {
        setSubmitted(true);
      }
    });
  };

  if (submitted) {
    return (
      <div>
        Vi har sendt en e-post til deg med informasjon om hvordan du kan
        tilbakestille passordet
      </div>
    );
  }

  return (
    <LegoFinalForm onSubmit={onSubmit} validate={validate}>
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
          <Field
            name="email"
            component={TextInput.Field}
            placeholder="E-post"
          />
          <SubmitButton danger>Tilbakestill passord</SubmitButton>
        </Form>
      )}
    </LegoFinalForm>
  );
};

export default ForgotPasswordForm;
