import { Card } from '@webkom/lego-bricks';
import cx from 'classnames';
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

const Banner = ({ header, subHeader, link, color, className }: Props) => {
  return (
    <LinkComponent className={className} link={link}>
      <Card className={cx(styles.header, color && COLORS[color])}>
        <h1>{header}</h1>
        {subHeader && <h4 className={styles.subHeader}>{subHeader}</h4>}
      </Card>
    </LinkComponent>
  );
};

export default Banner;
