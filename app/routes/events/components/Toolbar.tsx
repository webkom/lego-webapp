import { Button } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Link, NavLink } from 'react-router-dom';
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
        <Link to="/events/create">
          <Button flat>Lag nytt</Button>
        </Link>
      )}
    </div>
  </div>
);

export default Toolbar;
