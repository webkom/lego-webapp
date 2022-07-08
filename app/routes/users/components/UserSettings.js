// @flow

import type { FormProps } from 'redux-form';
import { Field } from 'redux-form';

import Button from 'app/components/Button';
import {
  Form,
  legoForm,
  PhoneNumberInput,
  RadioButton,
  RadioButtonGroup,
  TextInput,
} from 'app/components/Form';
import DeleteUser from 'app/routes/users/components/DeleteUser';
import RemovePicture from 'app/routes/users/components/RemovePicture';
import { createValidator, isEmail, required } from 'app/utils/validation';
import ChangePassword from './ChangePassword';
import UserImage from './UserImage';

import styles from './UserSettings.css';

export type PasswordPayload = {
  newPassword: string,
  password: string,
  retype_new_password: string,
};

type Props = FormProps & {
  changePassword: (PasswordPayload) => Promise<void>,
  updateUser: (Object) => Promise<void>,
  deleteUser: (Object) => Promise<void>,
  user: any,
  isMe: boolean,
  push: (string) => void,
  updatePicture: (Object) => void,
  removePicture: (string) => Promise<*>,
};

const UserSettings = (props: Props) => {
  const {
    handleSubmit,
    changePassword,
    invalid,
    isMe,
    pristine,
    submitting,
    updatePicture,
    removePicture,
    push,
    user,
    deleteUser,
  } = props;

  const disabledButton = invalid || pristine || submitting;
  const showAbakusMembership = user.isStudent;

  return (
    <div>
      <div className={styles.pictureSection}>
        <UserImage user={user} updatePicture={updatePicture} />
      </div>

      <RemovePicture username={user.username} removePicture={removePicture} />

      <Form onSubmit={handleSubmit}>
        <Field
          placeholder="Brukernavn"
          label="Brukernavn"
          name="username"
          readOnly
          component={TextInput.Field}
          props={{
            disabled: true,
          }}
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
            name="gender"
            label="Mann"
            inputValue="male"
            component={RadioButton.Field}
          />
          <Field
            name="gender"
            label="Kvinne"
            inputValue="female"
            component={RadioButton.Field}
          />
          <Field
            name="gender"
            label="Annet"
            inputValue="other"
            component={RadioButton.Field}
          />
        </RadioButtonGroup>
        <Field label="Allergier" name="allergies" component={TextInput.Field} />

        <Field
          placeholder="abc@stud.ntnu.no"
          label="Epost"
          name="email"
          component={TextInput.Field}
        />

        <Field
          label="Telefonnummer"
          name="phoneNumber"
          component={PhoneNumberInput.Field}
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
          <RadioButtonGroup name="isAbakusMember" label="Medlem i Abakus?">
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

        <Button success disabled={disabledButton} submit>
          Lagre
        </Button>
      </Form>

      {isMe && (
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

const validate = createValidator({
  username: [required()],
  firstName: [required()],
  lastName: [required()],
  gender: [required()],
  email: [required(), isEmail()],
});

export default legoForm({
  form: 'userSettings',
  validate,
  enableReinitialize: true,
  onSubmit: (data, dispatch, { updateUser }: Props) => updateUser(data),
})(UserSettings);
