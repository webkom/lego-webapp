// @flow

import { Link } from 'react-router-dom';
import { Field } from 'redux-form';

import {
  Button,
  Form,
  legoForm,
  PhoneNumberInput,
  RadioButton,
  RadioButtonGroup,
  TextInput,
} from 'app/components/Form';
import { Container, Flex } from 'app/components/Layout';
import { type UserEntity } from 'app/reducers/users';
import { createAsyncValidator } from 'app/utils/asyncValidator';
import { createValidator, required, sameAs } from 'app/utils/validation';
import { validPassword } from '../utils';
import PasswordField from './PasswordField';

import styles from './UserConfirmation.css';

type Props = {
  token: string,
  user: UserEntity,
  handleSubmit: (Function) => void,
  createUser: (token: string, data: Object) => void,
  router: any,
  submitSucceeded: () => void,
};

const UserConfirmation = ({
  token,
  user,
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
              <p className={styles.infoText}>
                For å kunne melde deg på arrangementer i Abakus må du verifisere
                at du er student. Om du ikke har fått studentepost enda, kan du
                alltids verifisere kontoen din senere.
              </p>
              <Flex>
                <Link to="/users/me/settings/student-confirmation/">
                  <Button>Verifiser studentepost</Button>
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
          <PasswordField user={user} />
          <Field
            label="Passord (gjenta)"
            name="retypePassword"
            type="password"
            autocomplete="new-password"
            component={TextInput.Field}
          />
          <Field
            name="firstName"
            placeholder="Fornavn"
            label="Fornavn"
            autocomplete="given-name additional-name"
            component={TextInput.Field}
          />
          <Field
            name="lastName"
            label="Etternavn"
            placeholder="Etternavn"
            autocomplete="family-name"
            component={TextInput.Field}
          />
          <RadioButtonGroup name="gender">
            <Field
              name="genderMan"
              label="Mann"
              component={RadioButton.Field}
              inputValue="male"
            />
            <Field
              name="genderWoman"
              label="Kvinne"
              component={RadioButton.Field}
              inputValue="female"
            />
            <Field
              name="genderOther"
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

          <Field
            label="Telefonnummer"
            name="phoneNumber"
            autocomplete="tel"
            component={PhoneNumberInput.Field}
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
  password: [required()],
  retypePassword: [required(), sameAs('password', 'Passordene er ikke like')],
  gender: [required()],
});

const asyncValidate = createAsyncValidator({
  password: [validPassword()],
});

const onSubmit = (data, dispatch, { token, createUser }) =>
  createUser(token, data);

export default legoForm({
  form: 'ConfirmationForm',
  validate,
  asyncValidate,
  onSubmit,
})(UserConfirmation);
