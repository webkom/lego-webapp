// @flow

import React, { Component } from 'react';
import Button from 'app/components/Button';
import { Form, TextInput } from 'app/components/Form';
import { Field } from 'redux-form';
import UserImage from './UserImage';
import styles from './UserSettings.css';

type Props = {
  handleSubmit: () => void,
  updateUser: () => void,
  invalid: boolean,
  pristine: boolean,
  submitting: boolean,
  user: any
};

export default class UserSettings extends Component {
  props: Props;

  render() {
    const { invalid, pristine, submitting } = this.props;

    const disabledButton = invalid || pristine || submitting;

    return (
      <div className={styles.root}>
        <UserImage user={this.props.user} />
        <Form onSubmit={this.props.handleSubmit(this.props.updateUser)}>
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
  }
}
