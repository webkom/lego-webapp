// @flow

import React from 'react';
import Icon from '../../Icon';
import styles from '../Header.css';

const EventsDropdown = () => {
  return (
    <div className={styles.eventsDropdownEl}>
      <div className={styles.dropdownSection} data-first-dropdown-section>
        <a className={styles.dropdownLink} href="/events">
          <div className={styles.iconFrame}>
            <Icon name="list" size={25} />
          </div>
          <div className={styles.textAndArrow}>
            <span>Kommende arrangementer</span>
            <Icon className={styles.icon} name="arrow-forward" size={20} />
          </div>
        </a>
        <a className={styles.dropdownLink} href="/events/calendar">
          <div className={styles.iconFrame}>
            <Icon name="calendar" size={25} />
          </div>
          <div className={styles.textAndArrow}>
            <span>Kalender</span>
            <Icon className={styles.icon} name="arrow-forward" size={20} />
          </div>
        </a>
      </div>
      <div className={styles.dropdownSection}>
        <a className={styles.altText} href="/users/me">
          Dine arrangementer
        </a>
      </div>
    </div>
  );
};

export default EventsDropdown;
