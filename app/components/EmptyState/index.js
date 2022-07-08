// @flow

import type { Node } from 'react';
import cx from 'classnames';

import Icon from '../Icon';

import styles from './EmptyState.css';

type Props = {
  /** name of icon */
  icon?: string,
  /** html to display in an EmptyState */
  children?: Node,
  size?: number,
  className?: string,
};

/**
 * A basic EmptyState component
 *
 */
const EmptyState = ({ icon, size = 88, className, children }: Props) => (
  <div className={cx(styles.container, icon && styles.centered, className)}>
    {icon && <Icon className={styles.icon} size={size} name={icon} />}
    {children}
  </div>
);
export default EmptyState;
