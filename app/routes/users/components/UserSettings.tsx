import { Flex, LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Field } from 'react-final-form';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchUser, updateUser } from 'app/actions/UserActions';
import {
  TextInput,
  MultiSelectGroup,
  RadioButton,
  PhoneNumberInput,
  SelectInput,
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
import { Gender } from 'app/store/models/User';
import {
  createValidator,
  required,
  isEmail,
  isValidAllergy,
  isValidGithubUsername,
  isValidLinkedinId,
  isNotAbakusEmail,
} from 'app/utils/validation';
import AllergiesOrPreferencesField from '../AllergiesOrPreferencesField';
import ChangePassword from './ChangePassword';
import UserImage from './UserImage';
import styles from './UserSettings.css';

export type PasswordPayload = {
  newPassword: string;
  password: string;
  retype_new_password: string;
};

type GenderKey = keyof typeof Gender;

type FormValues = {
  username: string;
  firstName: string;
  lastName: string;
  gender: { label: (typeof Gender)[GenderKey]; value: GenderKey };
  allergies: string;
  email: string;
  phoneNumber: string;
  selectedTheme: string;
  isAbakusMember: boolean;
  githubUsername: string;
  linkedinId: string;
};

const TypedLegoForm = LegoFinalForm<FormValues>;

const validate = createValidator({
  username: [required()],
  firstName: [required()],
  lastName: [required()],
  gender: [required()],
  email: [required(), isEmail(), isNotAbakusEmail()],
  allergies: [isValidAllergy()],
  githubUsername: [isValidGithubUsername()],
  linkedinId: [isValidLinkedinId()],
});

const UserSettings = () => {
  const params = useParams<{ username: string }>();
  const { currentUser } = useUserContext();
  const isCurrentUser = useIsCurrentUser(params.username!);
  const username = isCurrentUser ? currentUser.username : params.username!;
  const user = useAppSelector((state) => selectUserByUsername(state, username));

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

  const onSubmit = (values: FormValues) => {
    const body = {
      ...values,
      gender: values.gender.value,
    };

    dispatch(updateUser(body)).then(() => {
      navigate('/users/me');
    });
  };

  const initialValues: FormValues = {
    ...user,
    gender: { label: Gender[user.gender], value: user.gender },
    isAbakusMember: user?.isAbakusMember.toString(),
  };

  return (
    <>
      <TypedLegoForm
        onSubmit={onSubmit}
        initialValues={initialValues}
        validate={validate}
        subscription={{}}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Flex gap="var(--spacing-xl)">
              <Flex
                column
                justifyContent="center"
                alignItems="center"
                gap="var(--spacing-sm)"
              >
                <UserImage user={user} />
                <RemovePicture username={user.username} />
              </Flex>

              <Flex column className={styles.right}>
                <Field
                  placeholder="Brukernavn"
                  label="Brukernavn"
                  name="username"
                  readOnly
                  component={TextInput.Field}
                  disabled
                />

                <Flex gap="var(--spacing-md)">
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
                </Flex>

                <Flex gap="var(--spacing-md)">
                  <Field
                    placeholder="abc@xyz.no"
                    label="E-post"
                    name="email"
                    prefix="mail-outline"
                    component={TextInput.Field}
                  />
                  <Field
                    label="Telefonnummer"
                    name="phoneNumber"
                    component={PhoneNumberInput.Field}
                  />
                </Flex>
              </Flex>
            </Flex>

            <Flex gap="var(--spacing-md)" className={styles.bottom}>
              <Field
                name="gender"
                label="Kjønn"
                component={SelectInput.Field}
                options={Object.entries(Gender).map(([key, value]) => ({
                  label: value,
                  value: key,
                }))}
              />

              <AllergiesOrPreferencesField />
            </Flex>

            <Flex gap="var(--spacing-md)">
              <Field
                label="GitHub-brukernavn"
                name="githubUsername"
                component={TextInput.Field}
              />

              <Field
                label="LinkedIn-ID"
                name="linkedinId"
                component={TextInput.Field}
              />
            </Flex>

            <MultiSelectGroup label="Fargetema" name="selectedTheme">
              <Field
                name="selectedTheme"
                label="Auto"
                value="auto"
                type="radio"
                component={RadioButton.Field}
              />
              <Field
                name="selectedTheme"
                label="Lyst"
                value="light"
                type="radio"
                component={RadioButton.Field}
              />
              <Field
                name="selectedTheme"
                label="Mørkt"
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
            <SubmitButton>Lagre endringer</SubmitButton>
          </form>
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
