// @flow

import Icon from 'app/components/Icon';
import styles from '../Header.css';

const EventsDropdown = () => (
  <div className={styles.eventsDropdownEl}>
    <div className={styles.dropdownSection} data-first-dropdown-section>
      <a className={styles.dropdownLink} href="/events">
        <div className={styles.iconFrame}>
          <Icon name="list" size={25} />
        </div>
        <div className={styles.textAndArrow}>
          <h4>Kommende arrangementer</h4>
          <Icon className={styles.icon} name="arrow-forward" size={20} />
        </div>
      </a>
      <a className={styles.dropdownLink} href="/events/calendar">
        <div className={styles.iconFrame}>
          <Icon name="calendar" size={25} />
        </div>
        <div className={styles.textAndArrow}>
          <h4>Kalender</h4>
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

export default EventsDropdown;
