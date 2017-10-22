// @flow

import styles from './UserConfirmation.css';
import React from 'react';
import { Container } from 'app/components/Layout';
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
import type { ReduxFormProps } from 'app/types';

type Props = {
  studentConfirmed: boolean,
  handleSubmit: Function => void,
  sendStudentConfirmationEmail: () => void,
  router: any,
  loggedIn: boolean,
  submitSucceeded: () => void,
  isStudent: boolean
} & ReduxFormProps;

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
}: Props) => {
  if (!loggedIn) {
    router.push('/');
    return null;
  }
  if (isStudent) {
    return (
      <Container>
        <div className={styles.root}>
          <h2>Du er allerede verifisert!</h2>
        </div>
      </Container>
    );
  }
  if (submitSucceeded) {
    return (
      <Container>
        <div className={styles.root}>
          <h2>Sjekk eposten din!</h2>
        </div>
      </Container>
    );
  }
  if (studentConfirmed !== null) {
    return (
      <Container>
        <div className={styles.root}>
          <h2>{studentConfirmed ? 'Du er nå verifisert!' : 'Ugyldig token'}</h2>
          <Link to="/">Gå tilbake til hovedsiden</Link>
        </div>
      </Container>
    );
  }

  const disabledButton = invalid || pristine || submitting;
  return (
    <Container>
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
              inputValue="data"
            />
            <Field
              label="Kommunikasjonsteknologi"
              component={RadioButton.Field}
              inputValue="komtek"
            />
          </RadioButtonGroup>
          <RadioButtonGroup name="member" label="Vil du bli medlem i Abakus?">
            <Field label="Ja" component={RadioButton.Field} inputValue="true" />
            <Field
              label="Nei"
              component={RadioButton.Field}
              inputValue="false"
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
    </Container>
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
