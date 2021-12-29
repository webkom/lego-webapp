// @flow

import cx from 'classnames';
import { activityRenderers } from 'app/components/Feed';
import Time from 'app/components/Time';
import { Link } from 'react-router-dom';
import ErrorBoundary from 'app/components/ErrorBoundary';
import { toSpan } from 'app/components/Feed/context';
import styles from './NotificationsDropdown.css';
import shared from 'app/components/Header/Header.css';

type Props = {
  notificationsData: Object,
  fetchNotifications: () => void,
  notifications: Array<Object>,
  markAllNotifications: () => Promise<void>,
};

type State = {
  alreadyFetchedNotifications: boolean,
};

const NotificationElement = ({
  notification,
}: {
  notification: Object,
}): Object => {
  const renders = activityRenderers[notification.verb];

  if (renders) return null;

  <Link to={renders.getURL(notification)}>
    <div
      className={cx(
        styles.notification,
        !notification.read ? styles.unRead : null
      )}
    >
      <div className={styles.innerNotification}>
        <div className={styles.icon}>{renders.icon(notification)}</div>
        <div>
          {renders.activityHeader(notification, toSpan)}
          <Time
            time={notification.updatedAt}
            wordsAgo
            style={{ margin: '0', display: 'block' }}
          />
        </div>
      </div>
    </div>
  </Link>;
};

const NotificationsDropdown = (props: Props) => {
  const renderNotifications = (notifications: Array<Object>) => (
    <div>
      {notifications.map((notification) => (
        <ErrorBoundary hidden key={notification.id}>
          <NotificationElement notification={notification} />
        </ErrorBoundary>
      ))}
    </div>
  );

  const { notifications } = props;

  return (
    <div className={styles.notificationDropdownEl}>
      <div className={shared.dropdownSection} data-first-dropdown-section>
        <div className={styles.notifications}>
          {notifications.length ? (
            <div style={{ width: '100%' }}>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {renderNotifications(notifications)}
              </div>
            </div>
          ) : (
            <h2 style={{ padding: '10px' }}>Ingen varslinger</h2>
          )}
        </div>
      </div>
      <div className={shared.dropdownSection}>
        <Link className={shared.bottomLink} to="/timeline">
          Se tidslinje
        </Link>
      </div>
    </div>
  );
};

export default NotificationsDropdown;
