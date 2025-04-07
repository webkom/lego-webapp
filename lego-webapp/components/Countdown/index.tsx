import cx from 'classnames';
import { useEffect, useState } from 'react';
import styles from './Countdown.module.css';

type CountdownProps = {
  endDate?: Date | string;
  endMessage?: string;
  className?: string;
};

const Countdown = ({
  endDate,
  endMessage = 'Tiden er ute!',
  className,
}: CountdownProps) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [countdownEnded, setCountdownEnded] = useState(false);
  const [isValidDate, setIsValidDate] = useState(false);

  useEffect(() => {
    setTimeRemaining('');
    setCountdownEnded(false);

    if (!endDate) return;

    const parsedEndDate =
      typeof endDate === 'string' ? new Date(endDate) : endDate;

    if (isNaN(parsedEndDate.getTime())) {
      console.error('Invalid countdown end date:', endDate);
      setTimeRemaining('Ugyldig dato');
      setIsValidDate(false);
      return;
    }

    setIsValidDate(true);

    const updateCountdown = () => {
      try {
        const now = new Date();
        const diff = parsedEndDate.getTime() - now.getTime();

        if (diff <= 0) {
          setCountdownEnded(true);
          setTimeRemaining('');
          return;
        }

        const formatUnit = (value: number, unit1: string, unitN: string) =>
          value > 0 ? `${value} ${value === 1 ? unit1 : unitN}` : '';

        const daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hoursLeft = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);

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
  }, [endDate, endMessage]);

  if (!endDate || !isValidDate) return null;

  return (
    <div className={cx(styles.countdown, className)}>
      {countdownEnded ? endMessage : timeRemaining}
    </div>
  );
};

export default Countdown;
