// @flow

import React from 'react';
import cx from 'classnames';
import styles from './Content.css';

type Props = {
  className?: string,
  children: React.Element<*>,
  hasNavigation?: boolean
};

function Content({ children, className }: Props) {
  return <div className={cx(styles.content, className)}>{children}</div>;
}

export default Content;
