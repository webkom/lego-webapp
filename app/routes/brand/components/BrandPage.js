import React from 'react';
import { Content } from 'app/components/Content';
import NavigationTab from 'app/components/NavigationTab';
import styles from './BrandPage.css';

const BrandPage = () => {
  return (
    <Content>
      <NavigationTab title="Brand Guidelines" />
      <section>
        <div className={styles.root}>HTML CONTENT GOES HERE</div>
      </section>
    </Content>
  );
}


export default BrandPage;
