// @flow

import React from 'react';
import cx from 'classnames';
import RandomQuote from '../RandomQuote';

// CSS
import styles from './Footer.css';
import { hiddenOnMobile } from 'app/styles/utilities.css';

type Props = {
  loggedIn: boolean
};

const Footer = (props: Props) => (
  <footer className={styles.footer}>
    <div className={styles.footerContent}>
      <div className={cx(styles.section, hiddenOnMobile)}>
        <h2>Nettsiden</h2>
        <p>
          Har du et spørsmål eller funnet en feil? Send mail til{' '}
          <a href="mailto:webkom@abakus.no">webkom@abakus.no</a>.
        </p>
      </div>
      <div className={cx(styles.section, hiddenOnMobile)}>
        <RandomQuote loggedIn={props.loggedIn} />
      </div>
      <div className={styles.section}>
        <h2>Kontakt oss</h2>
        <a href="mailto:abakus@abakus.no">abakus@abakus.no</a>
        <p>Abakus</p>
        <p>Sem Sælands vei 7-9</p>
        <p>7491 Trondheim</p>
      </div>
    </div>
  </footer>
);

export default Footer;
