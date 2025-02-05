import { Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import styles from './EmptyState.module.css';
import type { ReactNode } from 'react';

type Props = {
  iconNode?: ReactNode;
  header?: string | ReactNode;
  body?: string | ReactNode;
  size?: number;
  className?: string;
};

const EmptyState = ({
  iconNode,
  header,
  body,
  size = 45,
  className,
}: Props) => (
  <div className={cx(styles.container, iconNode && styles.centered, className)}>
    {iconNode && <Icon iconNode={iconNode} size={size} />}
    {header && <h4>{header}</h4>}
    {body}
  </div>
);

export default EmptyState;
