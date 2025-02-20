import { BadgeIcon, LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import cx from 'classnames';
import { Bell, BellOff, BellRing } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import EmptyState from 'app/components/EmptyState';
import ErrorBoundary from 'app/components/ErrorBoundary';
import { SpanTag } from 'app/components/Feed/Tag';
import Time from 'app/components/Time';
import { fetchNotificationFeed } from '~/redux/actions/FeedActions';
import {
  fetchNotificationData,
  markAllNotifications,
} from '~/redux/actions/NotificationsFeedActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectFeedActivitiesByFeedId } from '~/redux/slices/feeds';
import Dropdown from '../Dropdown';
import { activityRenderers } from '../Feed';
import styles from './HeaderNotifications.module.css';
import type AggregatedFeedActivity from '~/redux/models/FeedActivity';

const NotificationElement = ({
  notification,
}: {
  notification: AggregatedFeedActivity;
}) => {
  const activityRenderer = activityRenderers[notification.verb];

  if (activityRenderer) {
    const { Icon, Header } = activityRenderer;
    return (
      <Link to={activityRenderer.getNotificationUrl(notification)}>
        <div
          className={cx(
            styles.notification,
            !notification.read && styles.unRead,
          )}
        >
          <div className={styles.innerNotification}>
            <div className={styles.icon}>
              <Icon />
            </div>
            <div>
              <Header aggregatedActivity={notification} tag={SpanTag} />
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
    selectFeedActivitiesByFeedId(state, 'notifications'),
  );
  const fetchingNotifications = useAppSelector(
    (state) => state.feedActivities.fetching,
  );

  if (fetchingNotifications && notifications.length === 0) {
    return <LoadingIndicator loading />;
  }

  if (!fetchingNotifications && notifications.length === 0) {
    return (
      <EmptyState iconNode={<BellOff />} body="Du har ingen varslinger ..." />
    );
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
    [],
  );

  const { unreadCount } = notificationsData;

  return (
    <Dropdown
      show={notificationsOpen}
      toggle={() => {
        setNotificationsOpen((prev) => !prev);

        if (!notificationsOpen) {
          dispatch(fetchNotificationFeed());
        } else {
          dispatch(markAllNotifications());
        }
      }}
      closeOnContentClick
      triggerComponent={
        <BadgeIcon
          iconNode={
            !notificationsOpen && unreadCount > 0 ? <BellRing /> : <Bell />
          }
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
