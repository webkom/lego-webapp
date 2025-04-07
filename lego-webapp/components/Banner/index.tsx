import { Card } from '@webkom/lego-bricks';
import cx from 'classnames';
import Countdown from '~/components/Countdown';
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
  link?: string;
  children: ReactNode;
  className?: string;
};
type Props = {
  header: string;
  subHeader?: string;
  link?: string;
  color?: Color;
  className?: string;
  countdownEndDate?: Date | string;
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
  countdownEndDate,
  countdownEndMessage = 'Tiden er ute!',
}: Props) => {
  const hasCountdown =
    countdownEndDate !== undefined && countdownEndDate !== null;

  return (
    <LinkComponent className={className} link={link}>
      <Card className={cx(styles.header, color && COLORS[color])}>
        <h1 className={styles.headerTitle}>{header}</h1>
        {hasCountdown && (
          <div className={styles.countdown}>
            <Countdown
              endDate={countdownEndDate}
              endMessage={countdownEndMessage}
              className={styles.countdownTime}
            />
          </div>
        )}
        {subHeader && <h4 className={styles.subHeader}>{subHeader}</h4>}
      </Card>
    </LinkComponent>
  );
};

export default Banner;
