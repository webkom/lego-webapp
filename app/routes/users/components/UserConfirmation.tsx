import { Card, Container, Flex } from '@webkom/lego-bricks';
import { Field } from 'react-final-form';
import { Link } from 'react-router-dom';
import {
  TextInput,
  MultiSelectGroup,
  RadioButton,
  Button,
  PhoneNumberInput,
} from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import type { UserEntity } from 'app/reducers/users';
import { spySubmittable } from 'app/utils/formSpyUtils';
import { createValidator, required, sameAs } from 'app/utils/validation';
import { validPassword } from '../utils';
import PasswordField from './PasswordField';
import styles from './UserConfirmation.css';
import type { RouteChildrenProps } from 'react-router';

export type Props = {
  token: string;
  user: UserEntity;
  createUser: (token: string, data: Record<string, any>) => void;
  submitSucceeded: boolean;
} & RouteChildrenProps<{ username: string }>;

const UserConfirmationForm = ({
  token,
  user,
  createUser,
  submitSucceeded,
}: Props) => {
  const onSubmit = (data) => createUser(token, data);

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
              <Card severity="warning">
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
        <LegoFinalForm onSubmit={onSubmit} validate={validate}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
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
              <MultiSelectGroup label="Kjønn" name="gender">
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
              </MultiSelectGroup>
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
              {spySubmittable((submittable) => (
                <Button submit disabled={!submittable}>
                  Registrer bruker
                </Button>
              ))}
            </form>
          )}
        </LegoFinalForm>
      </div>
    </Container>
  );
};

const validate = createValidator(
  {
    username: [required()],
    password: [required(), validPassword()],
    retypePassword: [required(), sameAs('password', 'Passordene er ikke like')],
    gender: [required()],
  },
  undefined,
  true
);

export default UserConfirmationForm;
