import styles from './UserConfirmation.css';
import React from 'react';
import { Content, Flex } from 'app/components/Layout';
import { reduxForm } from 'redux-form';
import {
  Form,
  TextInput,
  RadioButtonGroup,
  RadioButton,
  Button
} from 'app/components/Form';
import { Field } from 'redux-form';
import { Link } from 'react-router';

const UserConfirmation = ({
  token,
  handleSubmit,
  createUser,
  router,
  submitSucceeded,
  ...props
}) => {
  const onSubmit = data => createUser(token, data);

  if (submitSucceeded) {
    return (
      <Content>
        <div className={styles.root}>
          <Flex wrap justifyContent="center">
            <div>
              <h2>Du er nå registrert!</h2>
              <h3 style={{ margin: 0 }}>Er du student?</h3>
              <Flex>
                <Link to="/users/me/settings/student-confirmation/">
                  <b>Verifiser studentepost</b>
                </Link>
              </Flex>
              <Flex>
                <Link to="/" style={{ marginTop: '1em' }}>
                  Eller gå til hovedsiden
                </Link>
              </Flex>
            </div>
          </Flex>
        </div>
      </Content>
    );
  }
  if (!token) {
    return (
      <Content>
        <div className={styles.root}>
          <h2>Token ikke gyldig</h2>
        </div>
      </Content>
    );
  }
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
          <RadioButtonGroup name="gender">
            <Field
              label="Mann"
              component={RadioButton.Field}
              inputValue={'male'}
            />
            <Field
              label="Kvinne"
              component={RadioButton.Field}
              inputValue={'female'}
            />
            <Field
              label="Annet"
              component={RadioButton.Field}
              inputValue={'other'}
            />
          </RadioButtonGroup>
          <Field
            name="allergies"
            placeholder="Allergier"
            component={TextInput.Field}
          />
          <Button submit dark>
            Registrer bruker
          </Button>
        </Form>
      </div>
    </Content>
  );
};
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,72}$/;
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
