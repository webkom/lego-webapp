// @flow

import React from 'react';
import { Link, IndexLink } from 'react-router';
import Time from 'app/components/Time';
import Button from 'app/components/Button';
import styles from './Toolbar.css';

function Toolbar() {
  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <Time format='ll' className={styles.timeNow} />
      </div>

      <div className={styles.buttons}>
        <IndexLink
          to='/events'
          activeClassName={styles.active}
          className={styles.pickerItem}
        >Calendar</IndexLink>

        <Link
          to='/events/list'
          activeClassName={styles.active}
          className={styles.pickerItem}
        >List</Link>
      </div>

      <div className={styles.section}>
        <Button>Create Event</Button>
      </div>
    </div>
  );
}

export default Toolbar;
