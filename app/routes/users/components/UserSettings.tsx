

import React from 'react';
import { FieldProps } from 'redux-form';
import { Field } from 'redux-form';

import Button from 'app/components/Button';
import {
  Form,
  TextInput,
  RadioButtonGroup,
  RadioButton,
  legoForm
} from 'app/components/Form';
import { FlexRow } from 'app/components/FlexBox';
import UserImage from './UserImage';
import ChangePassword from './ChangePassword';
import styles from './UserSettings.css';
import { createValidator, required, isEmail } from 'app/utils/validation';

export type PasswordPayload = {
  newPassword: string,
  password: string,
  retype_new_password: string
};

type Props = FieldProps & {
  changePassword: PasswordPayload => Promise<void>,
  updateUser: Object => Promise<void>,
  user: any,
  isMe: boolean,
  push: string => void,
  updatePicture: Object => void
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
    push,
    user
  } = props;

  const disabledButton = invalid || pristine || submitting;
  const showAbakusMembership = user.isStudent;

  return (
    <div>
      <FlexRow justifyContent="center">
        <UserImage user={user} updatePicture={updatePicture} />
      </FlexRow>

      <Form onSubmit={handleSubmit}>
        <Field
          placeholder="Brukernavn"
          label="Brukernavn"
          name="username"
          readOnly
          component={TextInput.Field}
          props={{
            disabled: true
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
        {showAbakusMembership && (
          <RadioButtonGroup name="isAbakusMember" label="Medlem i Abakus?">
            <Field label="Ja" component={RadioButton.Field} inputValue="true" />
            <Field
              label="Nei"
              component={RadioButton.Field}
              inputValue="false"
            />
          </RadioButtonGroup>
        )}

        <Button disabled={disabledButton} submit>
          Submit
        </Button>
      </Form>

      {isMe && (
        <div className={styles.changePassword}>
          <h2>Endre passord</h2>
          <ChangePassword push={push} changePassword={changePassword} />
        </div>
      )}
    </div>
  );
};

const validate = createValidator({
  username: [required()],
  firstName: [required()],
  lastName: [required()],
  gender: [required()],
  email: [required(), isEmail()]
});

export default legoForm({
  form: 'userSettings',
  validate,
  enableReinitialize: true,
  onSubmit: (data, dispatch, { updateUser }: Props) => updateUser(data)
})(UserSettings);
