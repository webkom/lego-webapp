import cx from 'classnames';
import { Link, NavLink } from 'react-router-dom';
import Time from 'app/components/Time';
import type { ActionGrant } from 'app/models';
import styles from './Toolbar.module.css';

type Props = {
  actionGrant: ActionGrant;
};

const Toolbar = ({ actionGrant }: Props) => (
  <div className={styles.root}>
    <Time format="ll" className={styles.timeNow} />

    <NavLink
      exact
      to="/events"
      activeClassName={styles.active}
      className={cx(styles.pickerItem, styles.list)}
    >
      Liste
    </NavLink>

    <NavLink
      to="/events/calendar"
      activeClassName={styles.active}
      className={cx(styles.pickerItem, styles.calender)}
    >
      Kalender
    </NavLink>

    <div className={styles.create}>
      {actionGrant?.includes('create') && (
        <Link to="/events/create">Lag nytt</Link>
      )}
    </div>
  </div>
);

export default Toolbar;
