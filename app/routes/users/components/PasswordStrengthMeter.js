// @flow

import React, { Component, Fragment } from 'react';
import { pick } from 'lodash';
import moment from 'moment-timezone';
import zxcvbn from 'zxcvbn';
import Bar from 'react-meter-bar';
import styles from './PasswordStrengthMeter.css';
import {
  passwordLabel,
  barColor,
  passwordFeedbackMessages
} from './passwordStrengthVariables';

type Props = {
  password: string,
  user: Object
};

class PasswordStrengthMeter extends Component<Props> {
  render() {
    const { password, user } = this.props;
    const zxcvbnValue = zxcvbn(
      password,
      Object.values(pick(user, ['username', 'firstName', 'lastName']))
    );
    let tips = zxcvbnValue.feedback.suggestions;
    tips.push(zxcvbnValue.feedback.warning);
    tips = tips.map(tip => passwordFeedbackMessages[tip]).filter(Boolean);

    let crackTimeSec =
      zxcvbnValue.crack_times_seconds.offline_slow_hashing_1e4_per_second;
    let crackTimeDuration = moment.duration(crackTimeSec, 'seconds').humanize();
    let crackTime =
      crackTimeSec > 2 ? crackTimeDuration : crackTimeSec + ' sekunder';

    return (
      <Fragment>
        <div className={styles.removeLabels}>
          <Bar
            labels={[1, 2, 3, 4, 5]}
            labelColor="#000"
            progress={zxcvbnValue.score * 25}
            barColor={barColor[zxcvbnValue.score]}
            seperatorColor="#fff"
          />
        </div>
        {password && (
          <Fragment>
            <span>
              <strong>Passordstyrke: </strong>{' '}
              {passwordLabel[zxcvbnValue.score]}
            </span>
            <p>
              Dette passordet hadde tatt en maskin {crackTime} å knekke @ 10^4
              Hash/s.
            </p>
          </Fragment>
        )}
        {password && zxcvbnValue.score < 2 && (
          <ul className={styles.tipsList}>
            {tips.map((value, key) => {
              return <li key={key}>{value}</li>;
            })}
          </ul>
        )}
      </Fragment>
    );
  }
}

export default PasswordStrengthMeter;
