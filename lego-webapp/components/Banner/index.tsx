import { Card } from '@webkom/lego-bricks';
import cx from 'classnames';
import { useEffect, useState } from 'react';
import styles from './Banner.module.css';
import type { ReactNode } from 'react';
import type { $Keys } from 'utility-types';

export const COLORS = {
  red: styles.red,
  white: styles.white,
  gray: styles.gray,
  lightBlue: styles.lightBlue,
  itdageneBlue: styles.itdageneBlue,
  buddyweek2024: styles.buddyweek2024,
};
export type Color = $Keys<typeof COLORS>;
type LinkComponentProps = {
  link: string;
  children: ReactNode;
  className?: string;
};
type Props = {
  header: string;
  subHeader?: string;
  link: string;
  color?: Color;
  className?: string;
  showCountdown?: boolean;
  countdownEndDate?: Date | string;
  countdownPrefix?: string;
  countdownSuffix?: string;
  countdownEndMessage?: string;
};

const LinkComponent = ({ link, children, className }: LinkComponentProps) => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className={cx(styles.link, className)}
    >
      {children}
    </a>
  );
};

const Banner = ({
  header,
  subHeader,
  link,
  color,
  className,
  showCountdown,
  countdownEndDate,
  countdownPrefix = '',
  countdownSuffix = '',
  countdownEndMessage = 'Tiden er ute!',
}: Props) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [countdownEnded, setCountdownEnded] = useState(false);

  useEffect(() => {
    // Clear the timer state first
    setTimeRemaining('');
    setCountdownEnded(false);

    if (showCountdown === true && countdownEndDate) {
      const endDate = new Date(countdownEndDate as Date | string);

      if (!isNaN(endDate.getTime())) {
        updateCountdown();

        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
      }
    }

    function updateCountdown() {
      try {
        const now = new Date();
        const endDate = new Date(countdownEndDate as Date | string);

        if (isNaN(endDate.getTime())) {
          console.error('Invalid countdown end date:', countdownEndDate);
          setTimeRemaining('Ugyldig dato');
          return;
        }

        const diff = endDate.getTime() - now.getTime();

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
    }
  }, [showCountdown, countdownEndDate, countdownEndMessage]);

  return (
    <LinkComponent className={className} link={link}>
      <Card className={cx(styles.header, color && COLORS[color])}>
        <h1 className={styles.headerTitle}>{header}</h1>
        {showCountdown && (
          <div className={styles.countdown}>
            {countdownEnded ? (
              countdownEndMessage
            ) : (
              <>
                {countdownPrefix && (
                  <span className={styles.countdownPrefix}>
                    {countdownPrefix}
                  </span>
                )}
                <span className={styles.countdownTime}>{timeRemaining}</span>
                {countdownSuffix && (
                  <span className={styles.countdownSuffix}>
                    {countdownSuffix}
                  </span>
                )}
              </>
            )}
          </div>
        )}

        {subHeader && <h4 className={styles.subHeader}>{subHeader}</h4>}
      </Card>
    </LinkComponent>
  );
};

export default Banner;
