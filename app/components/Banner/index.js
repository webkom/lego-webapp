// @flow

import type { Node } from 'react';
import styles from './Banner.css';
import cx from 'classnames';
import { Link } from 'react-router-dom';

export const COLORS = {
  red: styles.red,
  white: styles.white,
  gray: styles.gray,
  lightBlue: styles.lightBlue,
};

type Color = $Keys<typeof COLORS>;

type Props = {
  header: string,
  subHeader?: string,
  link: string,
  color?: Color,
  // Set to true if the link is internal,
  // meaning an internal router <Link /> will be used
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
      <div className={cx(styles.header, props.color)}>
        <h1>{props.header}</h1>
        {props.subHeader && <h4>{props.subHeader}</h4>}
      </div>
    </LinkComponent>
  );
};

export default Banner;
