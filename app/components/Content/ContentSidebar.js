// @flow

import React, { type Node } from 'react';
import cx from 'classnames';
import { Flex } from 'app/components/Layout';
import styles from './ContentSidebar.css';

type Props = {
  className?: string,
  children: Node,
};

/**
 * Sidebar used next to ContentMain. Should usually be used
 * next to ContentMain, nested under ContentSection.
 * See Content for an example.
 */
function ContentSidebar({ children, className }: Props) {
  return (
    <Flex column className={cx(styles.sidebar, className)}>
      {children}
    </Flex>
  );
}

export default ContentSidebar;
