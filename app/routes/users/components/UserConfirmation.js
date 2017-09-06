import styles from './UserConfirmation.css';
import React from 'react';
import { Content, Flex } from 'app/components/Layout';
import { reduxForm } from 'redux-form';
import { Form, TextInput, RadioButton, Button } from 'app/components/Form';
import { Field } from 'redux-form';

const UserConfirmation = ({
  token,
  handleSubmit,
  createUser,
  router,
  ...props
}) => {
  if (!token) {
    return (
      <Content>
        <div className={styles.root}>
          <h2>Token ikke gyldig</h2>
        </div>
      </Content>
    );
  }

  const onSubmit = data =>
    createUser(token, data).then(() => {
      router.push('/');
    });

  return (
    <Content>
      <div className={styles.root}>
        <h2>Registrer bruker</h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Field
            name="username"
            placeholder="Brukernavn"
            component={TextInput.Field}
          />
          <Field
            name="password"
            type="password"
            placeholder="Passord"
            component={TextInput.Field}
          />
          <Field
            name="firstName"
            placeholder="Fornavn"
            component={TextInput.Field}
          />
          <Field
            name="lastName"
            placeholder="Etternavn"
            component={TextInput.Field}
          />
          <div>
            <Field
              fieldClassName={styles.radioButton}
              name="gender"
              label="Mann"
              component={RadioButton.Field}
              inputValue={'male'}
            />
            <Field
              fieldClassName={styles.radioButton}
              name="gender"
              label="Kvinne"
              component={RadioButton.Field}
              inputValue={'female'}
            />
            <Field
              fieldClassName={styles.radioButton}
              name="gender"
              label="Annet"
              component={RadioButton.Field}
              inputValue={'other'}
            />
          </div>
          <Field
            name="allergies"
            placeholder="Allergier"
            component={TextInput.Field}
          />
          <Button submit>Registrer bruker</Button>
        </Form>
      </div>
    </Content>
  );
};
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
const validate = data => {
  const errors = {};

  if (!data.username) {
    errors.username = 'Brukernavn er ikke fylt ut';
  }
  if (!passwordRegex.test(data.password)) {
    errors.password = 'Passordet må inneholde store og små bokstaver og tall';
  }
  if (!data.gender) {
    errors.gender = 'Vennligst velg et kjønn';
  }

  return errors;
};

export default reduxForm({
  form: 'ConfirmationForm',
  validate
})(UserConfirmation);
