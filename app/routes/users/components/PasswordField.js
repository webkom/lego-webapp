// @flow

import React, { Component, Fragment } from 'react';
import { TextInput } from 'app/components/Form';
import { Field } from 'redux-form';
import PasswordStrengthMeter from './PasswordStrengthMeter';

type Props = {
  user: Object
};

type State = {
  password: string
};

class PasswordField extends Component<Props, State> {
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
        <PasswordStrengthMeter
          password={this.state.password}
          user={this.props.user}
        />
      </Fragment>
    );
  }
}

export default PasswordField;
