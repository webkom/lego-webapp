// @flow

import React, { type Node } from 'react';
import styles from './Banner.css';
import cx from 'classnames';
import { Link } from 'react-router-dom';

export const COLORS = {
  red: styles.red,
  white: styles.white,
  gray: styles.gray,
  lightBlue: styles.lightBlue,
  revyBlue: styles.revyBlue,
};

type Color = $Keys<typeof COLORS>;

type Props = {
  text: string,
  link?: string,
  color?: Color,
  internal?: boolean,
};

const Banner = (props: Props) => {
  const LinkComponent = ({ children }: { children: Node }) => {
    return props.internal ? (
      <Link to={props.link}>{children}</Link>
    ) : (
      <a href={props.link} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  };
  return (
    <LinkComponent>
      <div className={cx(styles.header, props.color)}>{props.text}</div>
    </LinkComponent>
  );
};

export default Banner;
