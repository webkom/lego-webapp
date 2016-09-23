// @flow

import React, { Component } from 'react';
import styles from './Footer.css';

export default class Footer extends Component {
  render() {
    return (
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.section}>
            <h2>README</h2>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Fusce semper nunc at ex consequat ultricies.
          </div>
          <div className={styles.section}>
            <h2>Tilfeldig sitat</h2>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Fusce semper nunc at ex consequat ultricies.
          </div>
          <div className={styles.section}>
            <h2>Kontakt oss</h2>
              <a href='mailto:abakus@abakus.no'>abakus@abakus.no</a> <br />
              Abakus Linjeforening<br />
              Sem Sælands vei 7-9<br />
              7491 Trondheim
          </div>
        </div>
      </footer>
    );
  }
}
