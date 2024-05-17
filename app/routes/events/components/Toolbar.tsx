import cx from 'classnames';
import { NavLink } from 'react-router-dom';
import Time from 'app/components/Time';
import styles from './Toolbar.css';

const Toolbar = () => (
  <div className={styles.root}>
    <Time format="ll" className={styles.timeNow} />

    <NavLink
      end
      to="/events"
      className={({ isActive }) =>
        cx(isActive ? styles.active : '', styles.pickerItem, styles.list)
      }
    >
      Liste
    </NavLink>

    <NavLink
      to="/events/calendar"
      className={({ isActive }) =>
        cx(isActive ? styles.active : '', styles.pickerItem, styles.calendar)
      }
    >
      Kalender
    </NavLink>
  </div>
);

export default Toolbar;
