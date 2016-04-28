/** @flow */

import styles from './Header.css';
import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import Icon from 'app/components/Icon';

type State = {
  searchOpen: boolean;
};

export default class Header extends Component {
  state: State = {
    searchOpen: false
  };

  render() {
    return (
      <header className={styles.header}>
        <div className={styles.content}>
          <IndexLink to='/' className={styles.logo}>
            <img src='/images/logo_dark.png' />
          </IndexLink>

          <div className={styles.navigation}>
            <div>
              <Link to='/events'>Arrangementer</Link>
              <Link to=''>Karriere</Link>
            </div>
            <div className={styles.searchBox}>
              <Icon name='search' />
              <input placeholder='Søk...' className={styles.searchInput} />
            </div>
            <div>
              <Link to=''>README</Link>
              <Link to='/quotes'>Sitater</Link>
            </div>
          </div>
        </div>
      </header>
    );
  }
}
