import cx from 'classnames';
import { Link, NavLink } from 'react-router-dom';
import Icon from 'app/components/Icon';
import Time from 'app/components/Time';
import type { ActionGrant } from 'app/models';
import styles from './Toolbar.css';

type Props = {
  actionGrant: ActionGrant;
};

const Toolbar = ({ actionGrant }: Props) => (
  <div className={styles.root}>
    <div className={styles.header}>
      <h3 className={styles.title}>Arrangementer</h3>
      <div className={styles.create}>
        {actionGrant?.includes('create') && (
          <Link to="/events/create">Opprett nytt</Link>
        )}
      </div>
    </div>
    <div className={styles.picker}>
      <NavLink
        exact
        to="/events"
        activeClassName={styles.active}
        className={styles.pickerItem}
      >
        <Icon name="grid-outline" size={25}></Icon>
      </NavLink>

      <NavLink
        to="/events/calendar"
        activeClassName={styles.active}
        className={styles.pickerItem}
      >
        <Icon name="calendar-clear-outline" size={26}></Icon>
      </NavLink>
    </div>
  </div>
);

export default Toolbar;
