import { Card, Flex } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { normalize } from 'normalizr';
import qs from 'qs';
import { useState } from 'react';
import { Field } from 'react-final-form';
import { Link, useLocation } from 'react-router-dom';
import { User } from 'app/actions/ActionTypes';
import {
  createUser,
  saveToken,
  validateRegistrationToken,
} from 'app/actions/UserActions';
import { Content } from 'app/components/Content';
import {
  TextInput,
  MultiSelectGroup,
  RadioButton,
  Button,
  PhoneNumberInput,
} from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import { userSchema } from 'app/reducers';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { spyValues } from 'app/utils/formSpyUtils';
import {
  createValidator,
  isValidAllergy,
  required,
  sameAs,
} from 'app/utils/validation';
import { validPassword } from '../utils';
import Confetti from './Confetti';
import PasswordField from './PasswordField';

export type FormValues = {
  username?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  allergies?: string;
  phoneNumber?: string;
};

const TypedLegoForm = LegoFinalForm<FormValues>;

const UserConfirmationForm = () => {
  const [submitSucceeded, setSubmitSucceeded] = useState(false);

  const token = useAppSelector((state) => state.auth.registrationToken);

  const { search } = useLocation();

  usePreparedEffect(
    'fetchUserConfirmation',
    () => {
      const { token } = qs.parse(search, {
        ignoreQueryPrefix: true,
      });

      if (token && typeof token === 'string') {
        return dispatch(validateRegistrationToken(token));
      }
    },
    []
  );

  const dispatch = useAppDispatch();

  const onSubmit = (data) =>
    token &&
    dispatch(createUser(token, data)).then((action) => {
      if (!action || !action.payload) return;
      const { user, token } = action.payload;
      setSubmitSucceeded(true);
      saveToken(token);
      return dispatch({
        type: User.FETCH.SUCCESS,
        payload: normalize(user, userSchema),
        meta: {
          isCurrentUser: true,
        },
      });
    });

  if (submitSucceeded) {
    return (
      <>
        <Confetti />

        <Content>
          <h1>Du er nå registrert!</h1>

          <Card severity="warning">
            <Card.Header>Er du student?</Card.Header>
            <span>
              For å kunne melde deg på arrangementer i Abakus må du verifisere
              at du er student.
            </span>
          </Card>
          <Flex gap="1rem">
            <Link to="/users/me/settings/student-confirmation/">
              <Button success>Verifiser studentstatus</Button>
            </Link>
            <Link to="/">
              <Button>Eller gå til hovedsiden</Button>
            </Link>
          </Flex>
        </Content>
      </>
    );
  }

  if (!token) {
    return (
      <Content>
        <Card severity="danger">
          <Card.Header>Token ikke gyldig</Card.Header>
        </Card>
      </Content>
    );
  }

  return (
    <Content>
      <h1>Registrer bruker</h1>
      <TypedLegoForm onSubmit={onSubmit} validate={validate}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field
              name="username"
              placeholder="Brukernavn"
              label="Brukernavn"
              component={TextInput.Field}
            />

            {spyValues((values: FormValues) => {
              const user = {
                username: values.username,
                firstName: values.firstName,
                lastName: values.lastName,
              };

              return <PasswordField user={user} />;
            })}

            <Field
              label="Gjenta passord"
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
                value="male"
                type="radio"
                component={RadioButton.Field}
              />
              <Field
                name="genderWoman"
                label="Kvinne"
                value="female"
                type="radio"
                component={RadioButton.Field}
              />
              <Field
                name="genderOther"
                label="Annet"
                value="other"
                type="radio"
                component={RadioButton.Field}
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

            <SubmitButton>Registrer bruker</SubmitButton>
          </form>
        )}
      </TypedLegoForm>
    </Content>
  );
};

const validate = createValidator(
  {
    username: [required()],
    password: [required(), validPassword()],
    retypePassword: [required(), sameAs('password', 'Passordene er ikke like')],
    firstName: [required()],
    lastName: [required()],
    gender: [required()],
    allergies: [isValidAllergy()],
  },
  undefined,
  true
);

export default UserConfirmationForm;
