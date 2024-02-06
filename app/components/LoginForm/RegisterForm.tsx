import { useEffect, useState } from 'react';
import { Field } from 'react-final-form';
import { sendRegistrationEmail } from 'app/actions/UserActions';
import {
  Form,
  TextInput,
  Captcha,
  SubmitButton,
  SubmissionError,
  LegoFinalForm,
} from 'app/components/Form';
import { useAppDispatch } from 'app/store/hooks';
import { createValidator, required, isEmail } from 'app/utils/validation';

const validate = createValidator({
  email: [required(), isEmail()],
  captchaResponse: [required('Captcha er ikke validert')],
});

const RegisterForm = () => {
  const [mounted, setMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const dispatch = useAppDispatch();

  const onSubmit = (data) => {
    dispatch(sendRegistrationEmail(data)).then(() => {
      if (mounted) {
        setSubmitted(true);
      }
    });
  };

  if (submitted) {
    return (
      <div>
        Vi har sendt en e-post til deg hvor du kan fortsette registreringen
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
          <Field
            name="captchaResponse"
            fieldStyle={{
              width: 304,
            }}
            component={Captcha.Field}
          />

          <SubmissionError />
          <SubmitButton dark>Registrer deg</SubmitButton>
        </Form>
      )}
    </LegoFinalForm>
  );
};

export default RegisterForm;
