import cx from 'classnames';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ErrorBoundary from 'app/components/ErrorBoundary';
import type {
  AggregatedActivity,
  NotificationData,
} from 'app/components/Feed/types';
import Time from 'app/components/Time';
import Dropdown from '../Dropdown';
import { activityRenderers } from '../Feed';
import { toSpan } from '../Feed/context';
import Icon from '../Icon';
import styles from './HeaderNotifications.css';

const NotificationElement = ({ notification }) => {
  const renders = activityRenderers[notification.verb];

  if (renders) {
    return (
      <Link to={renders.getURL(notification)}>
        <div
          className={cx(
            styles.notification,
            !notification.read && styles.unRead
          )}
        >
          <div className={styles.innerNotification}>
            <div className={styles.icon}>{renders.icon(notification)}</div>
            <div>
              {renders.activityHeader(notification, toSpan)}
              <Time
                time={notification.updatedAt}
                wordsAgo
                className={styles.updatedAt}
              />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return null;
};

type Props = {
  notificationsData: NotificationData;
  fetchNotifications: () => void;
  notifications: AggregatedActivity[];
  markAllNotifications: () => Promise<void>;
  fetchNotificationData: () => Promise<void>;
};

const NotificationsDropdown = ({
  notificationsData,
  fetchNotifications,
  notifications,
  markAllNotifications,
  fetchNotificationData,
}: Props) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const fetch = () => {
    fetchNotifications();
    fetchNotificationData();
  };

  useEffect(() => {
    fetch();
  }, []);

  const renderNotifications = (notifications) => (
    <Dropdown.List className={styles.maxHeight}>
      {notifications.map((notification) => (
        <Dropdown.ListItem key={notification.id}>
          <ErrorBoundary hidden>
            <NotificationElement notification={notification} />
          </ErrorBoundary>
        </Dropdown.ListItem>
      ))}
    </Dropdown.List>
  );

  const { unreadCount } = notificationsData;
  return (
    <Dropdown
      show={notificationsOpen}
      toggle={() => {
        setNotificationsOpen(!notificationsOpen);
        if (!notificationsOpen) {
          fetchNotifications();
        } else {
          markAllNotifications();
        }
      }}
      closeOnContentClick
      triggerComponent={
        <Icon.Badge
          name="notifications"
          className={styles.notificationBell}
          badgeCount={notificationsOpen ? 0 : unreadCount}
        />
      }
      contentClassName={styles.notifications}
    >
      {notifications.length ? (
        renderNotifications(notifications)
      ) : (
        <h2 style={{ padding: '10px' }}>Ingen varslinger</h2>
      )}
    </Dropdown>
  );
};

export default NotificationsDropdown;
