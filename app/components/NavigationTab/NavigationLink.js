// @flow

import React, { type Node } from 'react';
import { NavLink } from 'react-router-dom';

import styles from './NavigationLink.css';

type Props = {
  to?: string,
  onClick?: (e: Event) => void,
  children?: Node,
};

const NavigationLink = (props: Props) => {
  return (
    <NavLink
      to={props.to}
      onClick={props.onClick}
      className={styles.link}
      activeClassName={styles.active}
    >
      {props.children}
    </NavLink>
  );
};

export default NavigationLink;
