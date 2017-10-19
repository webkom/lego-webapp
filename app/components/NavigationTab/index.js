// @flow

import React from 'react';

import NavigationLink from './NavigationLink';
import styles from './NavigationTab.css';
import cx from 'classnames';

type Props = {
  title: string,
  headerClassName: string,
  className?: string,
  children?: React$Element<*>
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
