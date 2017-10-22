// @flow

import React, { type Node } from 'react';

import NavigationLink from './NavigationLink';
import styles from './NavigationTab.css';
import cx from 'classnames';

type Props = {
  title: Node,
  headerClassName?: string,
  className?: string,
  headerClassName?: string,
  children: Node
};

const NavigationTab = (props: Props) => {
  return (
    <div className={cx(styles.container, props.className)}>
      <h1 className={cx(styles.header, props.headerClassName)}>
        {props.title}
      </h1>
      <div className={styles.navigator}>{props.children}</div>
    </div>
  );
};

export default NavigationTab;
export { NavigationLink };
