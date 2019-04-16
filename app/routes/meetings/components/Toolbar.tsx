

import React from 'react';
import styles from './Toolbar.css';
import { Flex } from 'app/components/Layout';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';

type Props = {};

const Toolbar = (props: Props) => {
  return (
    <Flex wrap alignItems="center" justifyContent="space-between">
      <NavigationTab title="Dine Møter" className={styles.detailTitle}>
        <NavigationLink to="/meetings/create/">Nytt møte</NavigationLink>
      </NavigationTab>
    </Flex>
  );
};

export default Toolbar;
