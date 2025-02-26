import Bar from '@webkom/react-meter-bar';
import '@webkom/react-meter-bar/style.css';
import moment from 'moment-timezone';
import { useEffect, useMemo, useState } from 'react';
import { isNotNullish } from '~/utils';
import styles from './PasswordStrengthMeter.module.css';
import {
  passwordLabel,
  barColor,
  passwordFeedbackMessages,
} from './passwordStrengthVariables';
import type { PasswordFieldUser } from './PasswordField';

type Props = {
  password: string;
  user?: PasswordFieldUser;
};
const loadZxcvbn = () => import('zxcvbn').then((module) => module.default);

const PasswordStrengthMeter = ({ password, user }: Props) => {
  const [zxcvbn, setZxcvbn] =
    useState<Awaited<ReturnType<typeof loadZxcvbn>>>();

  useEffect(() => {
    loadZxcvbn().then((zxcvbn) => setZxcvbn(() => zxcvbn));
  }, []);

  const zxcvbnValue = useMemo(
    () =>
      zxcvbn?.(
        password,
        [user?.username, user?.firstName, user?.lastName].filter(isNotNullish),
      ),
    [password, user, zxcvbn],
  );

  const { suggestions = [], warning } = zxcvbnValue?.feedback ?? {};
  const tips = [...suggestions, warning]
    .filter(isNotNullish)
    .map((tip) => passwordFeedbackMessages[tip]);
  const crackTimeSec = Number(
    zxcvbnValue?.crack_times_seconds?.offline_slow_hashing_1e4_per_second,
  );
  const crackTimeDuration = moment.duration(crackTimeSec, 'seconds').humanize();
  const crackTime =
    crackTimeSec > 2 ? crackTimeDuration : crackTimeSec + ' sekunder';
  return (
    <>
      <PasswordStrengthBar strengthScore={zxcvbnValue?.score ?? 0} />
      {password && zxcvbnValue ? (
        <>
          <span>
            <strong>Passordstyrke: </strong> {passwordLabel[zxcvbnValue.score]}
          </span>
          <span>
            Dette passordet hadde tatt en maskin {crackTime} å knekke @ 10⁴
            Hash/s.
          </span>
        </>
      ) : (
        <span>
          <strong>Kalkulerer passordstyrke</strong>
        </span>
      )}
      {password && zxcvbnValue && zxcvbnValue.score < 3 && (
        <ul className={styles.tipsList}>
          {tips.map((value, key) => {
            return <li key={key}>{value}</li>;
          })}
        </ul>
      )}
    </>
  );
};

const PasswordStrengthBar = ({ strengthScore }: { strengthScore: number }) => {
  return (
    <div className={styles.removeLabels}>
      <Bar
        labels={[1, 2, 3, 4, 5]}
        labelColor="#000"
        progress={strengthScore * 25}
        barColor={barColor[strengthScore]}
        separatorColor="#fff"
      />
    </div>
  );
};

export default PasswordStrengthMeter;
