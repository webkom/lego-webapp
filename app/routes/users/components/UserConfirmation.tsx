import { ButtonGroup, Card, LinkButton, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { normalize } from 'normalizr';
import qs from 'qs';
import { useState } from 'react';
import { Field } from 'react-final-form';
import { useLocation } from 'react-router-dom';
import { User } from 'app/actions/ActionTypes';
import {
  createUser,
  saveToken,
  validateRegistrationToken,
} from 'app/actions/UserActions';
import {
  TextInput,
  MultiSelectGroup,
  RadioButton,
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
import AllergiesOrPreferencesField from './AllergiesOrPreferencesField';
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
    [],
  );

  const dispatch = useAppDispatch();

  const onSubmit = (data: FormValues) => {
    if (!token) return;
    return dispatch(createUser(token, data)).then((action) => {
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
  };

  if (submitSucceeded) {
    return (
      <>
        <Confetti />

        <Page title="Du er nå registrert!">
          <Card severity="warning">
            <Card.Header>Er du student?</Card.Header>
            <span>
              For å kunne melde deg på arrangementer i Abakus må du verifisere
              at du er student.
            </span>
          </Card>
          <ButtonGroup>
            <LinkButton success href="/users/me/settings/student-confirmation/">
              Verifiser studentstatus
            </LinkButton>
            <LinkButton href="/">Eller gå til hovedsiden</LinkButton>
          </ButtonGroup>
        </Page>
      </>
    );
  }

  if (!token) {
    return (
      <Page>
        <Card severity="danger">
          <Card.Header>Token ikke gyldig</Card.Header>
        </Card>
      </Page>
    );
  }

  return (
    <Page title="Registrer bruker">
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
              required
              label="Gjenta passord"
              name="retypePassword"
              type="password"
              autocomplete="new-password"
              component={TextInput.Field}
            />

            <Field
              required
              name="firstName"
              placeholder="Fornavn"
              label="Fornavn"
              autocomplete="given-name additional-name"
              component={TextInput.Field}
            />

            <Field
              required
              name="lastName"
              label="Etternavn"
              placeholder="Etternavn"
              autocomplete="family-name"
              component={TextInput.Field}
            />

            <MultiSelectGroup required legend="Kjønn" name="gender">
              <Field
                name="genderMan"
                label="Mann"
                value="male"
                type="radio"
                component={RadioButton.Field}
                showErrors={false}
              />
              <Field
                name="genderWoman"
                label="Kvinne"
                value="female"
                type="radio"
                component={RadioButton.Field}
                showErrors={false}
              />
              <Field
                name="genderOther"
                label="Annet"
                value="other"
                type="radio"
                component={RadioButton.Field}
                showErrors={false}
              />
            </MultiSelectGroup>

            <AllergiesOrPreferencesField />

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
    </Page>
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
  true,
);

export default UserConfirmationForm;
