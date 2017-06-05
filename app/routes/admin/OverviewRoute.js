// @flow

import React from 'react';
import { Link } from 'react-router';
import styles from './Overview.css';

const OverviewRoute = ({ children }: { children: any }) => {
  return (
    <div className={styles.root}>
      <div className={styles.sidebar}>
        <ul>
          <li>
            <Link to="/admin/groups">Groups</Link>
          </li>
        </ul>
      </div>
      <div className={styles.main}>
        {children}
      </div>
    </div>
  );
};

export default OverviewRoute;
