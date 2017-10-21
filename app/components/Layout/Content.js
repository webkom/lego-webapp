// @flow

import React, { type Node } from 'react';
import cx from 'classnames';
import styles from './Content.css';

type Props = {
  className?: string,
  children: Node
};

function Content({ children, className }: Props) {
  return <div className={cx(styles.content, className)}>{children}</div>;
}

export default Content;
