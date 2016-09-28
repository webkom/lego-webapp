// @flow

import React from 'react';
import { Link, IndexLink } from 'react-router';
import Icon from 'app/components/Icon';
import styles from './Toolbar.css';

function Toolbar() {
  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <Icon name='plus' />
      </div>

      <div className={styles.buttons}>
        <IndexLink
          to='/events'
          activeClassName={styles.active}
        >Calendar</IndexLink>

        <Link
          to='/events/list'
          activeClassName={styles.active}
        >List</Link>
      </div>

      <div className={styles.section}>
        <Icon name='plus' />
      </div>
    </div>
  );
}

export default Toolbar;
