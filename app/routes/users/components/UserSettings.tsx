import { LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Field } from 'react-final-form';
import { useParams } from 'react-router-dom-v5-compat';
import { fetchUser, updateUser } from 'app/actions/UserActions';
import { Content } from 'app/components/Content';
import {
  Form,
  TextInput,
  MultiSelectGroup,
  RadioButton,
  PhoneNumberInput,
} from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import SubmissionError from 'app/components/Form/SubmissionError';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import { selectUserByUsername } from 'app/reducers/users';
import { useUserContext } from 'app/routes/app/AppRoute';
import DeleteUser from 'app/routes/users/components/DeleteUser';
import RemovePicture from 'app/routes/users/components/RemovePicture';
import { useIsCurrentUser } from 'app/routes/users/utils';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import {
  createValidator,
  required,
  isEmail,
  isValidAllergy,
  isValidGithubUsername,
  isValidLinkedinId,
} from 'app/utils/validation';
import ChangePassword from './ChangePassword';
import UserImage from './UserImage';
import styles from './UserSettings.css';

export type PasswordPayload = {
  newPassword: string;
  password: string;
  retype_new_password: string;
};

type FormValues = {
  username: string;
  firstName: string;
  lastName: string;
  gender: string;
  allergies: string;
  email: string;
  phoneNumber: string;
  selectedTheme: string;
  isAbakusMember: string;
  githubUsername: string;
  linkedinId: string;
};

const TypedLegoForm = LegoFinalForm<FormValues>;

const validate = createValidator({
  username: [required()],
  firstName: [required()],
  lastName: [required()],
  gender: [required()],
  email: [required(), isEmail()],
  allergies: [isValidAllergy()],
  githubUsername: [isValidGithubUsername()],
  linkedinId: [isValidLinkedinId()],
});

const UserSettings = () => {
  const params = useParams<{ username: string }>();
  const { currentUser } = useUserContext();
  const isCurrentUser = useIsCurrentUser(params.username);
  const username = isCurrentUser ? currentUser.username : params.username;
  const user = useAppSelector((state) =>
    selectUserByUsername(state, {
      username,
    })
  );

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchUserSettings',
    () => dispatch(fetchUser(username)),
    []
  );

  if (!user) {
    return <LoadingIndicator loading />;
  }

  const showAbakusMembership = user.isStudent;

  const onSubmit = (values: FormValues) => dispatch(updateUser(values));

  const initialValues = {
    ...user,
    isAbakusMember: user?.isAbakusMember.toString(),
  };

  return (
    <>
      <div className={styles.pictureSection}>
        <UserImage user={user} />
      </div>

      <RemovePicture username={user.username} />

      <TypedLegoForm
        onSubmit={onSubmit}
        initialValues={initialValues}
        validate={validate}
        subscription={{}}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Field
              placeholder="Brukernavn"
              label="Brukernavn"
              name="username"
              readOnly
              component={TextInput.Field}
              disabled
            />

            <Field
              placeholder="Fornavn"
              label="Fornavn"
              name="firstName"
              component={TextInput.Field}
            />

            <Field
              placeholder="Etternavn"
              label="Etternavn"
              name="lastName"
              component={TextInput.Field}
            />

            <MultiSelectGroup label="Kjønn" name="gender">
              <Field
                type="radio"
                name="gender"
                label="Mann"
                value="male"
                component={RadioButton.Field}
              />
              <Field
                type="radio"
                name="gender"
                label="Kvinne"
                value="female"
                component={RadioButton.Field}
              />
              <Field
                type="radio"
                name="gender"
                label="Annet"
                value="other"
                component={RadioButton.Field}
              />
            </MultiSelectGroup>

            <Field
              label="Matallergier/preferanser"
              parse={(value) => value}
              name="allergies"
              component={TextInput.Field}
            />

            <Field
              placeholder="abc@stud.ntnu.no"
              label="E-post"
              name="email"
              component={TextInput.Field}
            />

            <Field
              label="Telefonnummer"
              name="phoneNumber"
              component={PhoneNumberInput.Field}
            />

            <Field
              label="GitHub-brukernavn"
              name="githubUsername"
              component={TextInput.Field}
            />

            <Field
              label="Linkedin-ID"
              name="linkedinId"
              component={TextInput.Field}
            />

            <MultiSelectGroup label="Theme" name="selectedTheme">
              <Field
                name="selectedTheme"
                label="Auto"
                inputValue="auto"
                component={RadioButton.Field}
              />
              <Field
                name="selectedTheme"
                label="Light"
                inputValue="light"
                component={RadioButton.Field}
              />
              <Field
                name="selectedTheme"
                label="Dark"
                inputValue="dark"
                component={RadioButton.Field}
              />
            </MultiSelectGroup>

            {showAbakusMembership && (
              <MultiSelectGroup name="isAbakusMember" label="Medlem av Abakus?">
                <Field
                  name="isMemberYes"
                  label="Ja"
                  component={RadioButton.Field}
                  inputValue="true"
                />
                <Field
                  name="isMemberNo"
                  label="Nei"
                  component={RadioButton.Field}
                  inputValue="false"
                />
              </MultiSelectGroup>
            )}

            <SubmissionError />
            <SubmitButton>Lagre</SubmitButton>
          </Form>
        )}
      </TypedLegoForm>

      {isCurrentUser && (
        <>
          <div className={styles.changePassword}>
            <h2>Endre passord</h2>
            <ChangePassword />
          </div>
          <h2 className={styles.deleteUser}>Slett bruker</h2>
          <DeleteUser />
        </>
      )}
    </>
  );
};

export default UserSettings;
