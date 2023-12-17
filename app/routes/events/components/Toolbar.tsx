import { Button } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom-v5-compat';
import Time from 'app/components/Time';
import styles from './Toolbar.css';
import type { ActionGrant } from 'app/models';

type Props = {
  actionGrant: ActionGrant;
};

const Toolbar = ({ actionGrant }: Props) => (
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

    <div className={styles.create}>
      {actionGrant?.includes('create') && (
        <Link to="/events/create">
          <Button flat>Lag nytt</Button>
        </Link>
      )}
    </div>
  </div>
);

export default Toolbar;
