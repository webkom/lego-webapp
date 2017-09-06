// @flow

import React from 'react';
import { Link } from 'react-router';
import Button from 'app/components/Button';
import { Form, TextInput } from 'app/components/Form';
import { Flex } from 'app/components/Layout';
import { Field } from 'redux-form';
import UserImage from './UserImage';
import styles from './UserSettings.css';

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
  const { invalid, pristine, submitting, updatePicture } = props;

  const disabledButton = invalid || pristine || submitting;

  return (
    <div className={styles.root}>
      <UserImage user={props.user} updatePicture={updatePicture} />

      <Flex>
        <Link
          className={styles.navigationLink}
          to="/users/me/settings/notifications"
        >
          Notification settings
        </Link>
        <Link className={styles.navigationLink} to="/users/me/settings/oauth2">
          OAuth2 Applications And Grants
        </Link>
      </Flex>

      <Form onSubmit={props.handleSubmit(props.updateUser)}>
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
    </div>
  );
};

export default UserSettings;
