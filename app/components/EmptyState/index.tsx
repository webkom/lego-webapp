import { Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import styles from './EmptyState.css';
import type { ReactNode } from 'react';

type Props = {
  /** name of icon */
  icon?: string;

  /** html to display in an EmptyState */
  children?: ReactNode;
  size?: number;
  className?: string;
};

/**
 * A basic EmptyState component
 *
 */
const EmptyState = ({ icon, size = 88, className, children }: Props) => (
  <div className={cx(styles.container, icon && styles.centered, className)}>
    {icon && <Icon name={icon} size={size} />}
    {children}
  </div>
);

export default EmptyState;
