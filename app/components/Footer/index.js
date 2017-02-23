// @flow

import React from 'react';
import cx from 'classnames';
import styles from './Footer.css';
import RandomQuote from '../RandomQuote';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={cx(styles.section, 'u-hide-on-mobile')}>
          <h2>README</h2>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Fusce semper nunc at ex consequat ultricies.
        </div>
        <div className={cx(styles.section, 'u-hide-on-mobile')}>
          <RandomQuote />
        </div>
        <div className={styles.section}>
          <h2>Kontakt oss</h2>
          <a href='mailto:abakus@abakus.no'>abakus@abakus.no</a><br />
          7491 Trondheim<br />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
