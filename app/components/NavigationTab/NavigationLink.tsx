import React, { ReactNode } from 'react';
import { Link } from 'react-router';
import styles from './NavigationLink.css';

interface Props {
  to?: string;
  onClick?: () => void;
  children?: ReactNode;
}

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
