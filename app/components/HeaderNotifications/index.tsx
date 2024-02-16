import { Icon, LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import cx from 'classnames';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchNotificationFeed } from 'app/actions/FeedActions';
import {
  fetchNotificationData,
  markAllNotifications,
} from 'app/actions/NotificationsFeedActions';
import ErrorBoundary from 'app/components/ErrorBoundary';
import { toSpan } from 'app/components/Feed/context';
import Time from 'app/components/Time';
import { selectFeedActivitesByFeedId } from 'app/reducers/feeds';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import Dropdown from '../Dropdown';
import { activityRenderers } from '../Feed';
import styles from './HeaderNotifications.css';
import type FeedActivity from 'app/store/models/FeedActivity';

const NotificationElement = ({
  notification,
}: {
  notification: FeedActivity;
}) => {
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

const HeaderNotificationsContent = () => {
  const notifications = useAppSelector((state) =>
    selectFeedActivitesByFeedId(state, {
      feedId: 'notifications',
    })
  );
  const fetchingNotifications = useAppSelector(
    (state) => state.feedActivities.fetching
  );

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

const NotificationsDropdown = () => {
  const dispatch = useAppDispatch();
  const notificationsData = useAppSelector((state) => state.notificationsFeed);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  usePreparedEffect(
    'fetchNotificationDropdownData',
    () =>
      Promise.allSettled([
        dispatch(fetchNotificationFeed()),
        dispatch(fetchNotificationData()),
      ]),
    []
  );

  const { unreadCount } = notificationsData;
  return (
    <Dropdown
      show={notificationsOpen}
      toggle={() => {
        setNotificationsOpen(!notificationsOpen);
        if (!notificationsOpen) {
          dispatch(fetchNotificationFeed());
        } else {
          dispatch(markAllNotifications());
        }
      }}
      closeOnContentClick
      triggerComponent={
        <Icon.Badge
          name="notifications"
          badgeCount={notificationsOpen ? 0 : unreadCount}
        />
      }
      contentClassName={styles.notifications}
    >
      <HeaderNotificationsContent />
    </Dropdown>
  );
};

export default NotificationsDropdown;
