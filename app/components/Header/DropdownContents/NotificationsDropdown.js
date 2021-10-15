// @flow

import { Component } from 'react';
import cx from 'classnames';
import { activityRenderers } from 'app/components/Feed';
import Time from 'app/components/Time';
import styles from './NotificationsDropdown.css';
import { Link } from 'react-router-dom';
import ErrorBoundary from 'app/components/ErrorBoundary';
import { toSpan } from 'app/components/Feed/context';

import { compose } from 'redux';
import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';

import { selectFeedActivitesByFeedId } from 'app/reducers/feeds';
import {
  fetchNotificationData,
  markAllNotifications,
} from 'app/actions/NotificationsFeedActions';
import { fetchNotificationFeed } from 'app/actions/FeedActions';

type Props = {
  // notificationsData: Object,
  fetchNotifications: () => void,
  notifications: Array<Object>,
  // markAllNotifications: () => Promise<void>,
  // fetchNotificationData: () => Promise<void>,
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
  // fetch = () => {
  //   this.props.fetchNotifications();
  //   this.props.fetchNotificationData();
  // };

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
    <div
      className={styles.notificationDropdownEl}
      onMouseEnter={
        () => fetchNotificationData()
      }
      onMouseLeave={markAllNotifications}
    >
      <div className={styles.dropdownSection} data-first-dropdown-section>
        <div className={styles.notifications}>
          {/* notifications here */}
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

function mapStateToProps(state) {
  return {
    notificationsData: state.notificationsFeed,
    notifications: selectFeedActivitesByFeedId(state, {
      feedId: 'notifications',
    }),
  };
}

const mapDispatchToProps = {
  fetchNotificationFeed,
  markAllNotifications,
  fetchNotificationData,
};

export default compose(
  prepare(
    (props, dispatch) => Promise.resolve(dispatch(fetchNotificationData())),
    [],
    { awaitOnSsr: false }
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(NotificationsDropdown);
