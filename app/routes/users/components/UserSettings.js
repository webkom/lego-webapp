// @flow

import React from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { omit } from 'lodash';

import Button from 'app/components/Button';
import {
  Form,
  TextInput,
  RadioButtonGroup,
  RadioButton
} from 'app/components/Form';
import { FlexRow } from 'app/components/FlexBox';
import UserImage from './UserImage';
import ChangePassword from './ChangePassword';
import { createValidator, required, isEmail } from 'app/utils/validation';

type Props = {
  handleSubmit: () => void,
  updateUser: () => void,
  invalid: boolean,
  pristine: boolean,
  submitting: boolean,
  user: any,
  updatePicture: () => void
};

const UserSettings = (props: Props) => {
  const {
    handleSubmit,
    updateUser,
    changePassword,
    invalid,
    pristine,
    submitting,
    updatePicture,
    user
  } = props;

  const disabledButton = invalid || pristine || submitting;

  const onSubmit = data =>
    updateUser(omit(data, 'profilePicture')).catch(err => {
      if (err.payload && err.payload.response) {
        throw new SubmissionError(err.payload.response.jsonData);
      }
    });
  return (
    <div>
      <FlexRow justifyContent="center">
        <UserImage user={user} updatePicture={updatePicture} />
      </FlexRow>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Field
          placeholder="Brukernavn"
          label="Username"
          name="username"
          readOnly
          component={TextInput.Field}
          props={{
            disabled: true
          }}
        />

        <Field
          placeholder="Fornavn"
          label="First name"
          name="firstName"
          component={TextInput.Field}
        />

        <Field
          placeholder="Etternavn"
          label="Last name"
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
          label="email"
          name="email"
          component={TextInput.Field}
        />

        <Button disabled={disabledButton} submit>
          Submit
        </Button>
      </Form>
      <br />
      <hr />
      <br />
      <ChangePassword changePassword={changePassword} />
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

export default reduxForm({
  form: 'userSettings',
  validate,
  enableReinitialize: true
})(UserSettings);
