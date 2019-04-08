// @flow

import styles from './UserConfirmation.css';
import React from 'react';
import { Container, Flex } from 'app/components/Layout';
import {
  Form,
  TextInput,
  RadioButtonGroup,
  RadioButton,
  Button,
  legoForm
} from 'app/components/Form';
import { Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { createValidator, required, validPassword } from 'app/utils/validation';

type Props = {
  token: string,
  handleSubmit: Function => void,
  createUser: (token: string, data: Object) => void,
  router: any,
  submitSucceeded: () => void
};

const UserConfirmation = ({
  token,
  handleSubmit,
  createUser,
  router,
  submitSucceeded,
  ...props
}: Props) => {
  if (submitSucceeded) {
    return (
      <Container>
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
      </Container>
    );
  }
  if (!token) {
    return (
      <Container>
        <div className={styles.root}>
          <h2>Token ikke gyldig</h2>
        </div>
      </Container>
    );
  }
  return (
    <Container>
      <div className={styles.root}>
        <h2>Registrer bruker</h2>
        <Form onSubmit={handleSubmit}>
          <Field
            name="username"
            placeholder="Brukernavn"
            label="Brukernavn"
            component={TextInput.Field}
          />
          <Field
            name="password"
            type="password"
            placeholder="Passord"
            label="Passord"
            component={TextInput.Field}
          />
          <Field
            name="firstName"
            placeholder="Fornavn"
            label="Fornavn"
            component={TextInput.Field}
          />
          <Field
            name="lastName"
            label="Etternavn"
            placeholder="Etternavn"
            component={TextInput.Field}
          />
          <RadioButtonGroup name="gender">
            <Field
              label="Mann"
              component={RadioButton.Field}
              inputValue="male"
            />
            <Field
              label="Kvinne"
              component={RadioButton.Field}
              inputValue="female"
            />
            <Field
              label="Annet"
              component={RadioButton.Field}
              inputValue="other"
            />
          </RadioButtonGroup>
          <Field
            name="allergies"
            placeholder="Allergier"
            label="Allergier"
            component={TextInput.Field}
          />
          <Button submit dark>
            Registrer bruker
          </Button>
        </Form>
      </div>
    </Container>
  );
};

const validate = createValidator({
  username: [required()],
  password: [required(), validPassword()],
  gender: [required()]
});

const onSubmit = (data, dispatch, { token, createUser }) =>
  createUser(token, data);

export default legoForm({
  form: 'ConfirmationForm',
  validate,
  onSubmit
})(UserConfirmation);
