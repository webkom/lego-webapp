
import { Card } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import styles from './Calendar.module.css';
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
type Color = $Keys<typeof COLORS>;
type LinkComponentProps = {
  internal: boolean;
  link: string;
  children: ReactNode;
  className?: string;
};
type Props = {
  header: string;
  subHeader?: string;
  link: string;
  color?: Color;
  internal?: boolean; // true will use internal router: <Link />
  className?: string;
};

const LinkComponent = ({
  internal,
  link,
  children,
  className,
}: LinkComponentProps) => {
  return internal ? (
    <Link to={link} className={cx(styles.link, className)}>
      {children}
    </Link>
  ) : (
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

const Calendar = ({
  header,
  subHeader,
  link,
  color,
  internal = false,
  className,
}: Props) => {
  return (
    /*Lage liste over alle hatchene, og på noe vis mappe link og bilde til hver hatch"
    Må finne ut plan for layout
    */
  );
};

export default Calendar;
