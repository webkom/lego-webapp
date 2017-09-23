// @flow

import React from 'react';
import styles from './EmptyState.css';
import Icon from '../Icon';

type Props = {
  /** name of icon */
  icon: string,
  /** html to display in an EmptyState */
  children: React.Element<*>
};

/**
 * A basic EmptyState component
 *
 */
const EmptyState = ({ icon, children }: Props) => (
  <div className={styles.container}>
    <Icon className={styles.icon} name={icon} />
    {children}
  </div>
);
export default EmptyState;
