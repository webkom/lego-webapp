// @flow

import React, { type Node } from 'react';
import cx from 'classnames';
import { Flex } from 'app/components/Layout';
import styles from './ContentSidebar.css';

type Props = {
  className?: string,
  children: Node
};

function ContentSidebar({ children, className }: Props) {
  return (
    <Flex column className={cx(styles.sidebar, className)}>
      {children}
    </Flex>
  );
}

export default ContentSidebar;
