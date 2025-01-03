import { Flex, Icon, LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Github, Linkedin, Mail } from 'lucide-react';
import { Field } from 'react-final-form';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchUser, updateUser } from 'app/actions/UserActions';
import { ContentMain } from 'app/components/Content';
import {
  Form,
  LegoFinalForm,
  TextInput,
  MultiSelectGroup,
  RadioButton,
  PhoneNumberInput,
  SelectInput,
  SubmitButton,
  SubmissionError,
  RowSection,
} from 'app/components/Form';
import ToggleSwitch from 'app/components/Form/ToggleSwitch';
import { useCurrentUser } from 'app/reducers/auth';
import { selectUserByUsername } from 'app/reducers/users';
import DeleteUser from 'app/routes/users/components/UserSettings/DeleteUser';
import RemovePicture from 'app/routes/users/components/UserSettings/RemovePicture';
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
import styles from './UserSettings.module.css';
import type { CurrentUser } from 'app/store/models/User';

type GenderKey = keyof typeof Gender;

type FormValues = {
  username: string;
  firstName: string;
  lastName: string;
  gender: { label: (typeof Gender)[GenderKey]; value: GenderKey };
  allergies: string;
  email: string;
  phoneNumber?: string;
  selectedTheme: string;
  isAbakusMember: boolean;
  githubUsername?: string;
  linkedinId?: string;
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
  const currentUser = useCurrentUser();
  const isCurrentUser = useIsCurrentUser(params.username);
  const username = isCurrentUser ? currentUser?.username : params.username;
  const user = useAppSelector((state) =>
    selectUserByUsername<CurrentUser>(state, username),
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
  };

  return (
    <ContentMain>
      <TypedLegoForm
        onSubmit={onSubmit}
        initialValues={initialValues}
        validate={validate}
        subscription={{}}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Flex gap="var(--spacing-xl)" className={styles.mobileColumn}>
              <Flex
                column
                justifyContent="center"
                alignItems="center"
                gap="var(--spacing-sm)"
              >
                <UserImage user={user} />
                <RemovePicture username={user.username} />
              </Flex>

              <Flex column gap="var(--spacing-md)" className={styles.right}>
                <Field
                  placeholder="Brukernavn"
                  label="Brukernavn"
                  name="username"
                  readOnly
                  component={TextInput.Field}
                  disabled
                />

                <RowSection>
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
                </RowSection>

                <RowSection>
                  <Field
                    placeholder="abc@xyz.no"
                    label="E-post"
                    name="email"
                    prefixIconNode={<Icon iconNode={<Mail />} />}
                    component={TextInput.Field}
                  />
                  <Field
                    label="Telefonnummer"
                    name="phoneNumber"
                    component={PhoneNumberInput.Field}
                  />
                </RowSection>

                <RowSection>
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
                </RowSection>
              </Flex>
            </Flex>

            <RowSection>
              <Field
                label="GitHub-brukernavn"
                name="githubUsername"
                prefixIconNode={<Icon iconNode={<Github />} />}
                component={TextInput.Field}
              />

              <Field
                label="LinkedIn-ID"
                name="linkedinId"
                prefixIconNode={<Icon iconNode={<Linkedin />} />}
                component={TextInput.Field}
              />
            </RowSection>

            <MultiSelectGroup legend="Fargetema" name="selectedTheme">
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
              <Field
                name="isAbakusMember"
                label="Medlem av Abakus?"
                component={ToggleSwitch.Field}
              />
            )}

            <SubmissionError />
            <SubmitButton>Lagre endringer</SubmitButton>
          </Form>
        )}
      </TypedLegoForm>

      {isCurrentUser && (
        <>
          <div>
            <h2>Endre passord</h2>
            <ChangePassword />
          </div>
          <div>
            <h2 className={styles.deleteUser}>Slett bruker</h2>
            <DeleteUser />
          </div>
        </>
      )}
    </ContentMain>
  );
};

export default UserSettings;
