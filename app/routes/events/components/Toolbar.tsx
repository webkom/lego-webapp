import { LinkButton } from '@webkom/lego-bricks';
import cx from 'classnames';
import { NavLink } from 'react-router-dom';
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
        <LinkButton flat href="/events/create">
          Lag nytt
        </LinkButton>
      )}
    </div>
  </div>
);

export default Toolbar;
