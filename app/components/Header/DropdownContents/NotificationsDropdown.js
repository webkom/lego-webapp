// @flow

import { Component } from 'react';
import cx from 'classnames';
import { activityRenderers } from 'app/components/Feed';
import Time from 'app/components/Time';
import styles from './NotificationsDropdown.css';
import { Link } from 'react-router-dom';
import ErrorBoundary from 'app/components/ErrorBoundary';
import { toSpan } from 'app/components/Feed/context';

type Props = {
  notificationsData: Object,
  fetchNotifications: () => void,
  notifications: Array<Object>,
  markAllNotifications: () => Promise<void>,
};

type State = {
  alreadyFetchedNotifications: boolean,
};

const NotificationElement = ({ notification }: { notification: Object }) => {
  const renders = activityRenderers[notification.verb];
  if (renders) {
    return (
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
      </Link>
    );
  }
  return null;
};

const NotificationsDropdown = (props: Props) => {
  const renderNotifications = (notifications: Array<Object>) => {
    return (
      <div>
        {notifications.map((notification) => (
          <ErrorBoundary hidden key={notification.id}>
            <NotificationElement notification={notification} />
          </ErrorBoundary>
        ))}
      </div>
    );
  };

  const { notifications } = props;

  return (
    <div className={styles.notificationDropdownEl}>
      <div className={styles.dropdownSection} data-first-dropdown-section>
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
      <div className={styles.dropdownSection}>Se tidslinje</div>
    </div>
  );
};

export default NotificationsDropdown;
