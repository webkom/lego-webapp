import { Helmet } from 'react-helmet-async';
import { Flex } from 'app/components/Layout';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import styles from './Toolbar.css';

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
