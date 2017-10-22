// @flow

import React from 'react';
import { Link } from 'react-router';

import styles from './NavigationLink.css';

type Props = {
  to: string,
  children: string | React.Element<*>
};

const NavigationLink = (props: Props) => {
  return (
    <Link
      to={props.to}
      onlyActiveOnIndex
      className={styles.link}
      activeClassName={styles.active}
    >
      {props.children}
    </Link>
  );
};

export default NavigationLink;
