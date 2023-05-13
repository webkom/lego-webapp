import { Button } from '@webkom/lego-bricks';
import { Field } from 'react-final-form';
import {
  Form,
  TextInput,
  RadioButtonGroup,
  RadioButton,
  PhoneNumberInput,
} from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import type { UserEntity } from 'app/reducers/users';
import DeleteUser from 'app/routes/users/components/DeleteUser';
import RemovePicture from 'app/routes/users/components/RemovePicture';
import { useIsCurrentUser } from 'app/routes/users/utils';
import { spySubmittable } from 'app/utils/formSpyUtils';
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
interface Props {
  changePassword: (arg0: PasswordPayload) => Promise<void>;
  updateUser: (arg0: Record<string, any>) => Promise<void>;
  deleteUser: (arg0: Record<string, any>) => Promise<void>;
  user: UserEntity;
  push: (arg0: string) => void;
  updatePicture: (arg0: Record<string, any>) => void;
  removePicture: (arg0: string) => Promise<any>;
  initialValues: FormValues;
}

interface FormValues {
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
}

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

const UserSettings = (props: Props) => {
  const {
    changePassword,
    updatePicture,
    removePicture,
    push,
    user,
    deleteUser,
    initialValues,
    updateUser,
  } = props;
  const isCurrentUser = useIsCurrentUser(user.username);
  const showAbakusMembership = user.isStudent;

  const onSubmit = (values: FormValues) => updateUser(values);

  return (
    <div>
      <div className={styles.pictureSection}>
        <UserImage user={user} updatePicture={updatePicture} />
      </div>

      <RemovePicture username={user.username} removePicture={removePicture} />

      <LegoFinalForm
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

            <RadioButtonGroup label="Kjønn" name="gender">
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
            </RadioButtonGroup>

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
              label="Github Brukernavn"
              name="githubUsername"
              component={TextInput.Field}
            />

            <Field
              label="Linkedin Id"
              name="linkedinId"
              component={TextInput.Field}
            />

            <RadioButtonGroup label="Theme" name="selectedTheme">
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
            </RadioButtonGroup>

            {showAbakusMembership && (
              <RadioButtonGroup name="isAbakusMember" label="Medlem av Abakus?">
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
              </RadioButtonGroup>
            )}
            {spySubmittable((submittable) => (
              <Button success disabled={!submittable} submit>
                Lagre
              </Button>
            ))}
          </Form>
        )}
      </LegoFinalForm>

      {isCurrentUser && (
        <>
          <div className={styles.changePassword}>
            <h2>Endre passord</h2>
            <ChangePassword
              push={push}
              changePassword={changePassword}
              user={user}
            />
          </div>
          <h2 className={styles.deleteUser}>Slett bruker</h2>
          <DeleteUser push={push} user={user} deleteUser={deleteUser} />
        </>
      )}
    </div>
  );
};

export default UserSettings;
