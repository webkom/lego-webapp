// @flow

import React from 'react';
import { Field } from 'redux-form';
import { omit } from 'lodash';

import Button from 'app/components/Button';
import { Form, TextInput } from 'app/components/Form';
import { FlexRow } from 'app/components/FlexBox';
import UserImage from './UserImage';

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

  return (
    <div>
      <FlexRow justifyContent="center">
        <UserImage user={user} updatePicture={updatePicture} />
      </FlexRow>

      <Form
        onSubmit={handleSubmit(props => {
          updateUser(omit(props, 'profilePicture'));
        })}
      >
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

        <Field label="Kjønn" name="gender" component={TextInput.Field} />
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
      <Form onSubmit={handleSubmit(changePassword)}>
        <Field
          label="Gammelt passord"
          name="old_password"
          type="password"
          component={TextInput.Field}
        />
        <Field
          label="Nytt passord"
          name="new_password"
          type="password"
          component={TextInput.Field}
        />
        <Field
          label="Nytt passord (gjenta)"
          name="new_password_repeat"
          type="password"
          component={TextInput.Field}
        />
        <Button submit>Change Password</Button>
      </Form>
    </div>
  );
};

export default UserSettings;
