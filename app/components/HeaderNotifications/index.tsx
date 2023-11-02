import { Icon, LoadingIndicator } from '@webkom/lego-bricks';
import cx from 'classnames';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ErrorBoundary from 'app/components/ErrorBoundary';
import { toSpan } from 'app/components/Feed/context';
import type {
  AggregatedActivity,
  NotificationData,
} from 'app/components/Feed/types';
import Time from 'app/components/Time';
import Dropdown from '../Dropdown';
import { activityRenderers } from '../Feed';
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

type HeaderNotificationsContentProps = {
  notifications: AggregatedActivity[];
  fetchingNotifications: boolean;
};

const HeaderNotificationsContent = ({
  notifications,
  fetchingNotifications,
}: HeaderNotificationsContentProps) => {
  if (fetchingNotifications && notifications.length === 0) {
    return <LoadingIndicator loading />;
  }

  if (!fetchingNotifications && notifications.length === 0) {
    return <span className="secondaryFontColor">Ingen varslinger å vise</span>;
  }

  return (
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
};

type Props = {
  notificationsData: NotificationData;
  fetchNotifications: () => void;
  fetchingNotifications: boolean;
  notifications: AggregatedActivity[];
  markAllNotifications: () => Promise<void>;
  fetchNotificationData: () => Promise<void>;
};

const NotificationsDropdown = ({
  notificationsData,
  fetchNotifications,
  fetchingNotifications,
  notifications,
  markAllNotifications,
  fetchNotificationData,
}: Props) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
    fetchNotificationData();
  }, [fetchNotificationData, fetchNotifications]);

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
      <HeaderNotificationsContent
        notifications={notifications}
        fetchingNotifications={fetchingNotifications}
      />
    </Dropdown>
  );
};

export default NotificationsDropdown;
