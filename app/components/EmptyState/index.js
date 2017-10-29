// @flow

import React, { type Node } from 'react';
import styles from './EmptyState.css';
import Icon from '../Icon';
import cx from 'classnames';

type Props = {
  /** name of icon */
  icon?: string,
  /** html to display in an EmptyState */
  children?: Node,
  size?: number
};

/**
 * A basic EmptyState component
 *
 */
const EmptyState = ({ icon, size = 88, children }: Props) => (
  <div className={cx(styles.container, icon && styles.centered)}>
    {icon && <Icon className={styles.icon} size={size} name={icon} />}
    {children}
  </div>
);
export default EmptyState;
