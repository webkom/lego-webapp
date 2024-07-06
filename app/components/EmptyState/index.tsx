import { Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import styles from './EmptyState.css';
import type { ReactNode } from 'react';

type Props = {
  icon?: string;
  children?: ReactNode;
  size?: number;
  className?: string;
};

const EmptyState = ({ icon, size = 45, className, children }: Props) => (
  <div className={cx(styles.container, icon && styles.centered, className)}>
    {icon && <Icon name={icon} size={size} />}
    {children}
  </div>
);

export default EmptyState;
