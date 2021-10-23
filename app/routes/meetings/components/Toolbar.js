// @flow

import { Helmet } from 'react-helmet';
import styles from './Toolbar.css';
import { Flex } from 'app/components/Layout';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';

const Toolbar = () => {
  return (
    <div>
      <Helmet title="Dine møter" />
      <Flex wrap alignItems="center" justifyContent="space-between">
        <NavigationTab title="Dine Møter" className={styles.detailTitle}>
          <NavigationLink to="/meetings/create/">Nytt møte</NavigationLink>
        </NavigationTab>
      </Flex>
    </div>
  );
};

export default Toolbar;
