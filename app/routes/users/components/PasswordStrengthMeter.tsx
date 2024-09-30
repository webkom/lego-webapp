import loadable from '@loadable/component';
import Bar from '@webkom/react-meter-bar';
import '@webkom/react-meter-bar/style.css';
import moment from 'moment-timezone';
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
const Zxcvbn = loadable.lib(() => import('zxcvbn'), {
  ssr: false,
});

const PasswordStrengthMeter = ({ password, user }: Props) => {
  return (
    <Zxcvbn
      fallback={
        <>
          <PasswordStrengthBar strengthScore={0} />
          <span>
            <strong>Kalkulerer passordstyrke</strong>
          </span>
        </>
      }
    >
      {({ default: zxcvbn }) => {
        const zxcvbnValue = zxcvbn(password, [
          user?.username,
          user?.firstName,
          user?.lastName,
        ]);
        let tips = zxcvbnValue.feedback?.suggestions ?? [];
        tips.push(zxcvbnValue.feedback?.warning);
        tips = tips.map((tip) => passwordFeedbackMessages[tip]).filter(Boolean);
        const crackTimeSec = Number(
          zxcvbnValue.crack_times_seconds?.offline_slow_hashing_1e4_per_second,
        );
        const crackTimeDuration = moment
          .duration(crackTimeSec, 'seconds')
          .humanize();
        const crackTime =
          crackTimeSec > 2 ? crackTimeDuration : crackTimeSec + ' sekunder';
        return (
          <>
            <PasswordStrengthBar strengthScore={zxcvbnValue.score} />
            {password && (
              <>
                <span>
                  <strong>Passordstyrke: </strong>{' '}
                  {passwordLabel[zxcvbnValue.score]}
                </span>
                <p>
                  Dette passordet hadde tatt en maskin {crackTime} å knekke @
                  10⁴ Hash/s.
                </p>
              </>
            )}
            {password && zxcvbnValue.score < 3 && (
              <ul className={styles.tipsList}>
                {tips.map((value, key) => {
                  return <li key={key}>{value}</li>;
                })}
              </ul>
            )}
          </>
        );
      }}
    </Zxcvbn>
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
