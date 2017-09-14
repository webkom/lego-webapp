import styles from './UserConfirmation.css';
import React from 'react';
import { Content } from 'app/components/Layout';
import { reduxForm } from 'redux-form';
import {
  Form,
  TextInput,
  RadioButton,
  Button,
  Captcha
} from 'app/components/Form';
import { Link } from 'react-router';
import { Field } from 'redux-form';

const StudentConfirmation = ({
  studentConfirmed,
  handleSubmit,
  sendStudentConfirmationEmail,
  router,
  loggedIn,
  submitSucceeded,
  isStudent
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
          <div>
            <p>Hvilken linje tilhører du?</p>
            <Field
              fieldClassName={styles.radioButton}
              name="course"
              label="Datateknologi"
              component={RadioButton.Field}
              inputValue={'data'}
            />
            <Field
              fieldClassName={styles.radioButton}
              name="course"
              label="Kommunikasjonsteknologi"
              component={RadioButton.Field}
              inputValue={'komtek'}
            />
          </div>
          <div>
            <p>Vil du bli medlem i Abakus?</p>
            <Field
              fieldClassName={styles.radioButton}
              name="member"
              label="Ja"
              component={RadioButton.Field}
              inputValue={'true'}
            />
            <Field
              fieldClassName={styles.radioButton}
              name="member"
              label="Nei"
              component={RadioButton.Field}
              inputValue={'false'}
            />
          </div>
          <Field
            name="captchaResponse"
            fieldStyle={{ width: 304 }}
            component={Captcha.Field}
          />
          <Button submit>Verifiser</Button>
        </Form>
      </div>
    </Content>
  );
};

const validate = data => {
  const errors = {};

  if (!data.studentUsername) {
    errors.studentUsername = 'Vennligst fyll inn brukernavn';
  }
  if (!data.course) {
    errors.course = 'Feltet er påkrevet';
  }
  if (!data.member) {
    errors.member = 'Feltet er påkrevet';
  }

  return errors;
};

export default reduxForm({
  form: 'ConfirmationForm',
  validate
})(StudentConfirmation);
