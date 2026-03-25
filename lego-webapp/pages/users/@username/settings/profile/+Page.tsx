import { Accordion, Flex, Icon, LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import arrayMutators from 'final-form-arrays';
import { ChevronRight, Github, Linkedin, Mail } from 'lucide-react';
import { Field } from 'react-final-form';

import { ContentMain } from '~/components/Content';
import {
  Form,
  LegoFinalForm,
  TextInput,
  PhoneNumberInput,
  SelectInput,
  SubmitButton,
  SubmissionError,
  RowSection,
} from '~/components/Form';
import ToggleSwitch from '~/components/Form/ToggleSwitch';
import { useIsCurrentUser } from '~/pages/users/utils';
import { fetchUser, updateUser } from '~/redux/actions/UserActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { Gender } from '~/redux/models/User';
import { useCurrentUser } from '~/redux/slices/auth';
import { selectUserByUsername } from '~/redux/slices/users';
import { useParams } from '~/utils/useParams';
import {
  createValidator,
  required,
  isEmail,
  isValidAllergy,
  isValidGithubUsername,
  isValidLinkedinId,
  isNotAbakusEmail,
} from '~/utils/validation';
import AllergiesOrPreferencesField from '../../../_components/AllergiesOrPreferencesField';
import ChangePassword from './ChangePassword';
import DeleteUser from './DeleteUser';
import RemovePicture from './RemovePicture';
import ThemeSelector from './ThemeSelector';
import UserImage from './UserImage';
import styles from './UserSettings.module.css';
import type { CurrentUser } from '~/redux/models/User';
import ExchangeField from '../../_components/ExchangeField';

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
  exchanges: Array<{
    university: { label: string; value: number };
    semester: 'V' | 'H';
    year: number;
  }>;
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

  if (!user) {
    return <LoadingIndicator loading />;
  }

  const showAbakusMembership = user.isStudent;

  const onSubmit = (values: FormValues) => {
    const body = {
      ...values,
      gender: values.gender.value,
      exchanges: values.exchanges
        ?.filter((ex) => ex.university && ex.semester && ex.year)
        .map((ex) => ({
          university_id: ex.university!.value,
          semester: ex.semester!,
          year: ex.year!,
        })) || [],
    }

    dispatch(updateUser(body));
  };

  // Only seed fields this form actually owns, otherwise unrelated user updates
  // can reinitialize the form and reset the pristine state during hydration.
  const initialValues: FormValues = {
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    gender: { label: Gender[user.gender], value: user.gender },
    allergies: user.allergies,
    email: user.email,
    phoneNumber: user.phoneNumber ?? '',
    selectedTheme: user.selectedTheme,
    isAbakusMember: user.isAbakusMember,
    githubUsername: user.githubUsername ?? '',
    linkedinId: user.linkedinId ?? '',
    exchanges: user.exchanges?.map((exchange) => ({
      university: {
        label: `${exchange.university.name}, ${exchange.university.country.name}`,
        value: exchange.university.id,
      },
      semester: exchange.semester,
      year: exchange.year,
    })) || [],
  };

  return (
    <ContentMain>
      <TypedLegoForm
        onSubmit={onSubmit}
        initialValues={initialValues}
        validate={validate}
        keepDirtyOnReinitialize
        subscription={{}}
        mutators={{ ...arrayMutators }}

      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit} className={styles.settings}>
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
              <Flex
                column
                gap="var(--spacing-md)"
                className={styles.right}
                basis={false}
              >
                <Field
                  placeholder="Brukernavn"
                  label="Brukernavn"
                  name="username"
                  readOnly
                  required
                  component={TextInput.Field}
                  disabled
                />

                <RowSection>
                  <Field
                    placeholder="Fornavn"
                    label="Fornavn"
                    name="firstName"
                    required
                    component={TextInput.Field}
                  />

                  <Field
                    placeholder="Etternavn"
                    label="Etternavn"
                    name="lastName"
                    required
                    component={TextInput.Field}
                  />
                </RowSection>

                <RowSection>
                  <Field
                    placeholder="abc@xyz.no"
                    label="E-post"
                    name="email"
                    required
                    prefixIconNode={<Icon iconNode={<Mail />} />}
                    component={TextInput.Field}
                  />
                  <Field
                    label="Telefonnummer"
                    name="phoneNumber"
                    component={PhoneNumberInput.Field}
                    parse={(value) => value ?? ''}
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

            <Flex
              column
              justifyContent="center"
              alignItems="center"
              gap="var(--spacing-sm)"
              width={'100%'}
              basis={false}
            >
              <RowSection className={styles.socialLinks}>
                <Field
                  label="GitHub-brukernavn"
                  name="githubUsername"
                  prefixIconNode={<Icon iconNode={<Github />} />}
                  component={TextInput.Field}
                  parse={(value) => value}
                />

                <Field
                  label="LinkedIn-ID"
                  name="linkedinId"
                  prefixIconNode={<Icon iconNode={<Linkedin />} />}
                  component={TextInput.Field}
                  parse={(value) => value}
                />
              </RowSection>

              <ExchangeField />
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
            </Flex>

            <ThemeSelector />

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
        <Flex column gap="var(--spacing-md)">
          <Accordion
            persistChildren
            triggerComponent={({ onClick, disabled, rotateClassName }) => (
              <div className={styles.advancedSettings} onClick={onClick}>
                <Flex gap="var(--spacing-sm)" alignItems="center">
                  <h2>Avansert</h2>
                  {!disabled && (
                    <Icon
                      onPress={onClick}
                      iconNode={<ChevronRight />}
                      className={rotateClassName}
                    />
                  )}
                </Flex>
              </div>
            )}
          >
            <Flex column gap="var(--spacing-md)">
              <div>
                <h2>Endre passord</h2>
                <ChangePassword />
              </div>
              <div>
                <h2 className={styles.deleteUser}>Slett bruker</h2>
                <DeleteUser />
              </div>
            </Flex>
          </Accordion>
        </Flex>
      )}
    </ContentMain>
  );
};

export default UserSettings;
