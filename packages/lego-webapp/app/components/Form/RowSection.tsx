import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import styles from './Form.module.css';
import type { ReactNode, HTMLAttributes } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

/**
 * Used in a Form to create a row with two columns.
 */
function RowSection({
  children,
  className,
  ...props
}: Props & HTMLAttributes<HTMLDivElement>) {
  return (
    <Flex
      wrap
      justifyContent="space-between"
      gap="var(--spacing-md)"
      className={cx(styles.rowSection, className)}
      {...props}
    >
      {children}
    </Flex>
  );
}

export default RowSection;
