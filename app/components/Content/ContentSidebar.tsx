import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import styles from './ContentSidebar.css';
import type { ReactNode } from 'react';

type Props = {
  className?: string;
  children: ReactNode;
};

/**
 * Sidebar used next to ContentMain. Should usually be used
 * next to ContentMain, nested under ContentSection.
 * See Content for an example.
 */
function ContentSidebar({ children, className }: Props) {
  return (
    <Flex
      column
      gap="var(--spacing-sm)"
      className={cx(styles.sidebar, className)}
    >
      {children}
    </Flex>
  );
}

export default ContentSidebar;
