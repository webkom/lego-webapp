// @flow

import React, { Component, Fragment } from 'react';
import { TextInput } from 'app/components/Form';
import { Field } from 'redux-form';
import PasswordStrengthMeter from './PasswordStrengthMeter';

type Props = {
  user: Object,
  label: string,
  name: string
};

type State = {
  password: string
};

class PasswordField extends Component<Props, State> {
  state = {
    password: ''
  };

  static defaultProps = {
    user: {},
    label: 'Password',
    name: 'password'
  };

  render() {
    const { name, label, user } = this.props;
    return (
      <Fragment>
        <Field
          name={name}
          type="password"
          placeholder={label}
          label={label}
          component={TextInput.Field}
          onChange={e => this.setState({ password: e.target.value })}
        />
        <PasswordStrengthMeter password={this.state.password} user={user} />
      </Fragment>
    );
  }
}

export default PasswordField;
