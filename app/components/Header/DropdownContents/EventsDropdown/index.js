// @flow

import Icon from 'app/components/Icon';
import { NavLink } from 'react-router-dom';
import styles from './EventsDropdown.css';
import shared from 'app/components/Header/Header.css';

const EventsDropdown = () => (
  <div className={styles.eventsDropdownEl}>
    <div className={shared.dropdownSection} data-first-dropdown-section>
      <NavLink
        exact
        to="/events"
        className={shared.dropdownLink}
        activeClassName={shared.activeDropdownLink}
      >
        <Icon name="list" prefix="ion-md-" size={22} />
        <span>Liste</span>
      </NavLink>
      <NavLink
        exact
        to="/events/calendar"
        className={shared.dropdownLink}
        activeClassName={shared.activeDropdownLink}
      >
        <Icon name="calendar" prefix="ion-md-" size={22} />
        <span>Kalender</span>
      </NavLink>
    </div>
  </div>
);

export default EventsDropdown;
