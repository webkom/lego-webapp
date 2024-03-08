import { LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Field } from 'react-final-form';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchUser, updateUser } from 'app/actions/UserActions';
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
    }),
  );

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchUserSettings',
    () => dispatch(fetchUser(username)),
    [],
  );

  const navigate = useNavigate();

  if (!user) {
    return <LoadingIndicator loading />;
  }

  const showAbakusMembership = user.isStudent;

  const onSubmit = (values: FormValues) =>
    dispatch(updateUser(values)).then(() => {
      navigate('/users/me');
    });

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
                name="gender"
                label="Mann"
                value="male"
                type="radio"
                component={RadioButton.Field}
              />
              <Field
                name="gender"
                label="Kvinne"
                value="female"
                type="radio"
                component={RadioButton.Field}
              />
              <Field
                name="gender"
                label="Annet"
                value="other"
                type="radio"
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
                value="auto"
                type="radio"
                component={RadioButton.Field}
              />
              <Field
                name="selectedTheme"
                label="Light"
                value="light"
                type="radio"
                component={RadioButton.Field}
              />
              <Field
                name="selectedTheme"
                label="Dark"
                value="dark"
                type="radio"
                component={RadioButton.Field}
              />
            </MultiSelectGroup>

            {showAbakusMembership && (
              <MultiSelectGroup name="isAbakusMember" label="Medlem av Abakus?">
                <Field
                  name="isMemberYes"
                  label="Ja"
                  value="true"
                  type="radio"
                  component={RadioButton.Field}
                />
                <Field
                  name="isMemberNo"
                  label="Nei"
                  value="false"
                  type="radio"
                  component={RadioButton.Field}
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
