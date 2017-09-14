// @flow

import React from 'react';

import NavigationLink from './NavigationLink';
import styles from './NavigationTab.css';

type Props = {
  title: string,
  children: React$Element<*>
};

const NavigationTab = (props: Props) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>{props.title}</h1>
      <div className={styles.navigator}>{props.children}</div>
    </div>
  );
};

export default NavigationTab;
export { NavigationLink };
