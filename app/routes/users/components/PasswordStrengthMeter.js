// @flow

import React, { Component, Fragment } from 'react';
import zxcvbn from 'zxcvbn';
import styles from './PasswordStrengthMeter.css';

type Props = {
  password: string
};

class PasswordStrengthMeter extends Component<Props> {
  passwordLabel = {
    0: 'Veldig svakt',
    1: 'Svakt',
    2: 'OK',
    3: 'Bra',
    4: 'Sterkt'
  };

  render() {
    const { password } = this.props;
    const zxcvbnValue = zxcvbn(password);
    console.log(zxcvbnValue);
    return (
      <Fragment>
        <meter
          className={styles.passwordStrengthMeter}
          value={zxcvbnValue.score}
          max="4"
          optimum="4"
          high="3"
          low="2"
        />
        {password && (
          <div>
            <strong>Passordstyrke: </strong>{' '}
            {this.passwordLabel[zxcvbnValue.score]}{' '}
          </div>
        )}
      </Fragment>
    );
  }
}

export default PasswordStrengthMeter;
