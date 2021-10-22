// @flow

import React from 'react';
import Icon from '../../Icon';
import styles from '../Header.css';

type Props = {};

const LoginDropdown = (props: Props) => {
  return (
    <div className={styles.eventsDropdownEl}>
      <div className={styles.dropdownSection} data-first-dropdown-section>
        pp
      </div>
      <div className={styles.dropdownSection}>
        <a className={styles.altText} href="/users/me">
          Logg inn
        </a>
      </div>
    </div>
  );
};

export default LoginDropdown;
