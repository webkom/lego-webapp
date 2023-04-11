import cx from 'classnames';
import { Flex } from 'app/components/Layout';
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
    <Flex column gap={7} className={cx(styles.sidebar, className)}>
      {children}
    </Flex>
  );
}

export default ContentSidebar;
