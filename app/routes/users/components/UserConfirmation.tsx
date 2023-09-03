import { Card, Container, Flex } from '@webkom/lego-bricks';
import { Link } from 'react-router-dom';
import { Field } from 'redux-form';
import {
  Form,
  TextInput,
  RadioButtonGroup,
  RadioButton,
  Button,
  legoForm,
  PhoneNumberInput,
} from 'app/components/Form';
import type { UserEntity } from 'app/reducers/users';
import { createAsyncValidator } from 'app/utils/asyncValidator';
import { createValidator, required, sameAs } from 'app/utils/validation';
import { validPassword } from '../utils';
import PasswordField from './PasswordField';
import styles from './UserConfirmation.css';
import type { RouteChildrenProps } from 'react-router';

export type Props = {
  token: string;
  user: UserEntity;
  handleSubmit: (arg0: (...args: Array<any>) => any) => void;
  createUser: (token: string, data: Record<string, any>) => void;
  router: any;
  submitSucceeded: boolean;
} & RouteChildrenProps<{ username: string }>;

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
              <h3
                style={{
                  margin: 0,
                }}
              >
                Er du student?
              </h3>
              <Card severity="danger">
                <span>
                  For å kunne melde deg på arrangementer i Abakus må du
                  verifisere at du er student.
                </span>
              </Card>
              <Flex>
                <Link to="/users/me/settings/student-confirmation/">
                  <Button success>Verifiser studentstatus</Button>
                </Link>
              </Flex>
              <Flex>
                <Link
                  to="/"
                  style={{
                    marginTop: '1em',
                  }}
                >
                  <Button>Eller gå til hovedsiden</Button>
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
          <RadioButtonGroup label="Kjønn" name="gender">
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
            label="Matallergier/preferanser"
            component={TextInput.Field}
          />

          <Field
            label="Telefonnummer"
            name="phoneNumber"
            autocomplete="tel"
            component={PhoneNumberInput.Field}
          />
          <Button submit>Registrer bruker</Button>
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
