import { Card } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Link } from 'react-router-dom';
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

const Banner = ({
  header,
  subHeader,
  link,
  color,
  internal = false,
  className,
}: Props) => {
  return (
    <LinkComponent className={className} internal={internal} link={link}>
      <Card className={cx(styles.header, color && COLORS[color])}>
        <h1>{header}</h1>
        {subHeader && <h4 className={styles.subHeader}>{subHeader}</h4>}
      </Card>
    </LinkComponent>
  );
};

export default Banner;
