import { Button, ConfirmModal, Flex, Icon } from '@webkom/lego-bricks';
import { useEffect, useState } from 'react';
import { Field } from 'react-final-form';
import {
  Form,
  TextInput,
  Captcha,
  SubmitButton,
  SubmissionError,
  LegoFinalForm,
} from '~/components/Form';
import Tooltip from '~/components/Tooltip';
import { sendRegistrationEmail } from '~/redux/actions/UserActions';
import { useAppDispatch } from '~/redux/hooks';
import { spyValues } from '~/utils/formSpyUtils';
import { createValidator, required, isEmail } from '~/utils/validation';
import styles from './RegisterForm.module.css';

const isStudMail = (email: string) =>
  email.toLowerCase().endsWith('@stud.ntnu.no') ||
  email.toLowerCase().endsWith('@ntnu.no');

type FormValues = Partial<{
  email: string;
  captchaResponse: string;
}>;

const TypedLegoForm = LegoFinalForm<FormValues>;

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
    <TypedLegoForm onSubmit={onSubmit} validate={validate}>
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
          <Field
            name="email"
            component={TextInput.Field}
            placeholder="E-post"
          />
          <Field name="captchaResponse" component={Captcha.Field} />

          <SubmissionError />

          {spyValues<FormValues>((values) => {
            if (values.email && isStudMail(values.email)) {
              return (
                <ConfirmModal
                  title="Pass på!"
                  message={
                    <>
                      <p>
                        Det ser ut som du prøver å registrere deg med en
                        student-e-post. Denne kommer du til å miste tilgang til
                        når du går ut fra NTNU, og da vil du ikke lenger kunne
                        lese e-post om oppdateringer som tilbakestilling av
                        passord og{' '}
                        <Tooltip
                          content="For å respektere personvern og ikke lagre informasjon vi ikke trenger,
                          sletter vi brukere som ikke har vært logget inn på ett år. I en liten perioden
                          fram til dette skjer sender vi ut e-post for å advare deg i tilfelle du vil
                          beholder brukeren din."
                          className={styles.tooltip}
                        >
                          <Flex alignItems="center" gap="var(--spacing-xs)">
                            automatisk sletting
                            <Icon name="help-circle-outline" size={18} />
                          </Flex>
                        </Tooltip>{' '}
                        av brukeren din.
                      </p>
                      <p>Er du sikker på at du vil fortsette?</p>
                    </>
                  }
                  onConfirm={handleSubmit}
                >
                  {({ openConfirmModal }) => (
                    <Button onPress={openConfirmModal} dark>
                      Registrer deg
                    </Button>
                  )}
                </ConfirmModal>
              );
            }

            return <SubmitButton dark>Registrer deg</SubmitButton>;
          })}
        </Form>
      )}
    </TypedLegoForm>
  );
};

export default RegisterForm;
