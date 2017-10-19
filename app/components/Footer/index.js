// @flow

import React from 'react';
import cx from 'classnames';
import RandomQuote from '../RandomQuote';

// CSS
import styles from './Footer.css';
import { hiddenOnMobile } from 'app/styles/utilities.css';

const Footer = props => (
  <footer className={styles.footer}>
    <div className={styles.footerContent}>
      <div className={cx(styles.section, hiddenOnMobile)}>
        <h2>Lego</h2>
        <p>
          Velkommen til LEGO, den nye nettsiden til Abakus. Vi i Webkom har
          arbeidet lenge med denne siden og håper den faller i smak. Spørsmål
          eller rapportering av feil gjøres til{' '}
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
