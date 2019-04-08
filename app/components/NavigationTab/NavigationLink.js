// @flow

import React, { type Node } from 'react';
import { Link } from 'react-router-dom';

import styles from './NavigationLink.css';

type Props = {
  to?: string,
  onClick?: (e: Event) => void,
  children?: Node
};

const NavigationLink = (props: Props) => {
  return (
    <Link
      to={props.to}
      onClick={props.onClick}
      onlyActiveOnIndex
      className={styles.link}
      activeClassName={styles.active}
    >
      {props.children}
    </Link>
  );
};

export default NavigationLink;
