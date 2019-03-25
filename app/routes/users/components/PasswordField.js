// @flow

import React, { Component, Fragment } from 'react';
import { TextInput } from 'app/components/Form';
import { Field } from 'redux-form';
import PasswordStrengthMeter from './PasswordStrengthMeter';

type State = {
  password: string
};

class PasswordField extends Component<State> {
  state = {
    password: ''
  };

  render() {
    return (
      <Fragment>
        <Field
          name="password"
          type="password"
          placeholder="Passord"
          label="Passord"
          component={TextInput.Field}
          onChange={e => this.setState({ password: e.target.value })}
        />
        <PasswordStrengthMeter password={this.state.password} />
      </Fragment>
    );
  }
}

export default PasswordField;
