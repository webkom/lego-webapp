// @flow

import React from 'react';
import styles from './Banner.css';
import cx from 'classnames';
import { Link } from 'react-router-dom';

export const COLORS = {
  red: styles.red,
  white: styles.white,
  gray: styles.gray,
};

type Color = $Keys<typeof colors>;

type Props = {
  text: string,
  link?: string,
  color?: Color,
  internal?: boolean,
};

const Banner = (props: Props) => {
  const Router = ({ children }) => {
    return props.internal ? (
      <Link to={props.link}>{children}</Link>
    ) : (
      <a href={props.link} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  };
  return (
    <Router>
      <div className={cx(styles.header, props.color)}>{props.text}</div>
    </Router>
  );
};

export default Banner;
