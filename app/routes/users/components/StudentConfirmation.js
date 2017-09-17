import styles from './UserConfirmation.css';
import React from 'react';
import { Content } from 'app/components/Layout';
import { reduxForm } from 'redux-form';
import {
  Form,
  TextInput,
  RadioButton,
  RadioButtonGroup,
  Button,
  Captcha
} from 'app/components/Form';
import { Link } from 'react-router';
import { Field } from 'redux-form';
import { createValidator, required } from 'app/utils/validation';

const StudentConfirmation = ({
  studentConfirmed,
  handleSubmit,
  sendStudentConfirmationEmail,
  router,
  loggedIn,
  submitSucceeded,
  isStudent,
  invalid,
  pristine,
  submitting
}) => {
  if (!loggedIn) {
    router.push('/');
    return null;
  }
  if (isStudent) {
    return (
      <Content>
        <div className={styles.root}>
          <h2>Du er allerede verifisert!</h2>
        </div>
      </Content>
    );
  }
  if (submitSucceeded) {
    return (
      <Content>
        <div className={styles.root}>
          <h2>Sjekk eposten din!</h2>
        </div>
      </Content>
    );
  }
  if (studentConfirmed !== null) {
    return (
      <Content>
        <div className={styles.root}>
          <h2>{studentConfirmed ? 'Du er nå verifisert!' : 'Ugyldig token'}</h2>
          <Link to="/">Gå tilbake til hovedsiden</Link>
        </div>
      </Content>
    );
  }

  const disabledButton = invalid | pristine | submitting;
  return (
    <Content>
      <div>
        <h2>Verifiser studentepost</h2>
        <Form onSubmit={handleSubmit(sendStudentConfirmationEmail)}>
          <Field
            name="studentUsername"
            placeholder="NTNU Brukernavn"
            component={TextInput.Field}
          />
          <RadioButtonGroup name="course" label="Hvilken linje tilhører du?">
            <Field
              label="Datateknologi"
              component={RadioButton.Field}
              inputValue={'data'}
            />
            <Field
              label="Kommunikasjonsteknologi"
              component={RadioButton.Field}
              inputValue={'komtek'}
            />
          </RadioButtonGroup>
          <RadioButtonGroup name="member" label="Vil du bli medlem i Abakus?">
            <Field
              label="Ja"
              component={RadioButton.Field}
              inputValue={'true'}
            />
            <Field
              label="Nei"
              component={RadioButton.Field}
              inputValue={'false'}
            />
          </RadioButtonGroup>
          <Field
            name="captchaResponse"
            fieldStyle={{ width: 304 }}
            component={Captcha.Field}
          />
          <Button submit disabled={disabledButton}>
            Verifiser
          </Button>
        </Form>
      </div>
    </Content>
  );
};

const validate = createValidator({
  studentUsername: [required()],
  course: [required()],
  member: [required()],
  captchaResponse: [required('Captcha er ikke validert')]
});

export default reduxForm({
  form: 'ConfirmationForm',
  validate
})(StudentConfirmation);
