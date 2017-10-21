// @flow

import React, { type Node } from 'react';

import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import styles from './EmailIndex.css';

type Props = {
  children: Node
};

const EmailIndex = (props: Props) => {
  return (
    <div className={styles.root}>
      <NavigationTab title="E-post">
        <NavigationLink to="/email/restricted">Begrenset E-post</NavigationLink>
        <NavigationLink to="/email/users">Brukere</NavigationLink>
        <NavigationLink to="/email/groups">Grupper</NavigationLink>
        <NavigationLink to="/email/lists">Lister</NavigationLink>
      </NavigationTab>
      {props.children}
    </div>
  );
};

export default EmailIndex;
