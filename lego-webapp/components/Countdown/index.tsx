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
  const [timeRemaining, setTimeRemaining] = useState('');
  const [countdownEnded, setCountdownEnded] = useState(false);
  const [isValidDate, setIsValidDate] = useState(false);

  useEffect(() => {
    setTimeRemaining('');
    setCountdownEnded(false);

    if (!endDate) return;

    const parsedEndDate = moment(endDate).tz(timezone);

    if (!parsedEndDate.isValid()) {
      console.error('Invalid countdown end date:', endDate);
      setTimeRemaining('Ugyldig dato');
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
          setTimeRemaining('');
          return;
        }

        const formatUnit = (value: number, unit1: string, unitN: string) =>
          value > 0 ? `${value} ${value === 1 ? unit1 : unitN}` : '';

        const duration = moment.duration(diff);
        const daysLeft = Math.floor(duration.asDays());
        const hoursLeft = duration.hours();
        const minutesLeft = duration.minutes();
        const secondsLeft = duration.seconds();

        const units = [
          formatUnit(daysLeft, 'dag', 'dager'),
          formatUnit(hoursLeft, 'time', 'timer'),
          formatUnit(minutesLeft, 'minutt', 'minutter'),
          formatUnit(secondsLeft, 'sekund', 'sekunder'),
        ].filter(Boolean);

        setTimeRemaining(units.join(', '));
      } catch (error) {
        console.error('Error updating countdown:', error);
        setTimeRemaining('Feil med nedtelling');
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [endDate, endMessage, timezone]);

  if (!endDate || !isValidDate) return null;

  return (
    <div className={cx(styles.countdown, className)}>
      {countdownEnded ? endMessage : timeRemaining}
    </div>
  );
};

export default Countdown;
