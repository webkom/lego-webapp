import cx from 'classnames';
import moment from 'moment-timezone';
import { useEffect, useState } from 'react';
import { Dateish } from 'app/models';
import styles from './Countdown.module.css';

type CountdownProps = {
  endDate?: Dateish | string;
  endMessage?: string;
  className?: string;
  timezone?: string;
};

const Countdown = ({
  endDate,
  endMessage = 'Tiden er ute!',
  className,
  timezone = 'Europe/Oslo',
}: CountdownProps) => {
  const [timeRemaining, setTimeRemaining] = useState<
    { value: string; label: string }[]
  >([]);
  const [countdownEnded, setCountdownEnded] = useState(false);
  const [isValidDate, setIsValidDate] = useState(false);

  useEffect(() => {
    setCountdownEnded(false);

    if (!endDate) return;

    const parsedEndDate = moment(endDate).tz(timezone);

    if (!parsedEndDate.isValid()) {
      console.error('Invalid countdown end date:', endDate);
      setIsValidDate(false);
      return;
    }

    setIsValidDate(true);

    const updateCountdown = () => {
      try {
        const now = moment().tz(timezone);
        const diff = parsedEndDate.valueOf() - now.valueOf();

        if (diff <= 0) {
          setCountdownEnded(true);
          return;
        }

        const duration = moment.duration(diff);
        const daysLeft = Math.floor(duration.asDays());
        const hoursLeft = duration.hours();
        const minutesLeft = duration.minutes();
        const secondsLeft = duration.seconds();

        const units = [
          {
            value: String(daysLeft).padStart(2, '0'),
            label: daysLeft === 1 ? 'dag' : 'dager',
          },
          {
            value: String(hoursLeft).padStart(2, '0'),
            label: hoursLeft === 1 ? 'time' : 'timer',
          },
          { value: String(minutesLeft).padStart(2, '0'), label: 'min' },
          { value: String(secondsLeft).padStart(2, '0'), label: 'sek' },
        ];

        setTimeRemaining(units);
      } catch (error) {
        console.error('Error updating countdown:', error);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [endDate, endMessage, timezone]);

  if (!endDate || !isValidDate) return null;

  return (
    <div className={cx(styles.countdown, className)}>
      {countdownEnded ? (
        endMessage
      ) : (
        <div className={styles.unitContainer}>
          {timeRemaining.map((unit, index) => (
            <div key={index} className={styles.unit}>
              <div className={styles.value}>{unit.value}</div>
              <div className={styles.label}>{unit.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Countdown;
