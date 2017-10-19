// @flow

import React from 'react';
import { Link } from 'react-router';

import styles from './NavigationLink.css';

type Props = {
  to: string,
  children: React$Element<*>
};

const NavigationLink = (props: Props) => {
  return (
    <Link to={props.to} className={styles.link} activeClassName={styles.active}>
      {props.children}
    </Link>
  );
};

export default NavigationLink;
