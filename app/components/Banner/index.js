// @flow

import type { Node } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import styles from './Banner.css';

export const COLORS = {
  red: styles.red,
  white: styles.white,
  gray: styles.gray,
  lightBlue: styles.lightBlue,
  itdageneBlue: styles.itdageneBlue,
  buddyweek2022: styles.buddyweek2022,
};

type Color = $Keys<typeof COLORS>;

type Props = {
  header: string,
  subHeader?: string,
  link: string,
  color?: Color,
  internal?: boolean, // true will use internal router: <Link />
};

const Banner = (props: Props) => {
  const { header, subHeader, link, color, internal } = props;
  const LinkComponent = ({ children }: { children: Node }) => {
    return internal ? (
      <Link to={link}>{children}</Link>
    ) : (
      <a href={link} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  };
  return (
    <LinkComponent>
      <div className={cx(styles.header, color)}>
        <h1>{header}</h1>
        {subHeader && <h4>{subHeader}</h4>}
      </div>
    </LinkComponent>
  );
};

export default Banner;
