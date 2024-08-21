import { Flex, Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import styles from './EmptyState.css';
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
  <Flex
    column
    gap="var(--spacing-sm)"
    className={cx(styles.container, iconNode && styles.centered, className)}
  >
    {iconNode && <Icon iconNode={iconNode} size={size} />}
    {header && <h4>{header}</h4>}
    {body}
  </Flex>
);

export default EmptyState;
