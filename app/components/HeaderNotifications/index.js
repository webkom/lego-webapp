// @flow
import React, { Component } from 'react';
import cx from 'classnames';
import Dropdown from '../Dropdown';
import Icon from '../Icon';
import { activityRenderers } from '../Feed';
import Time from 'app/components/Time';
import styles from './HeaderNotifications.css';
import { Link } from 'react-router-dom';
import ErrorBoundary from 'app/components/ErrorBoundary';
import { toSpan } from '../Feed/context';

type Props = {
  notificationsData: Object,
  fetchNotifications: () => void,
  notifications: Array<Object>,
  markAllNotifications: () => Promise<void>,
  fetchNotificationData: () => Promise<void>
};

type State = {
  notificationsOpen: boolean
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

export default class NotificationsDropdown extends Component<Props, State> {
  state = {
    notificationsOpen: false
  };

  fetch = () => {
    this.props.fetchNotifications();
    this.props.fetchNotificationData();
  };

  renderNotifications = (notifications: Array<Object>) => {
    return (
      <div>
        {notifications.map(notification => (
          <ErrorBoundary hidden key={notification.id}>
            <NotificationElement notification={notification} />
          </ErrorBoundary>
        ))}
      </div>
    );
  };

  render() {
    const { notificationsData, fetchNotifications, notifications } = this.props;
    const { unreadCount } = notificationsData;

    return (
      <Dropdown
        show={this.state.notificationsOpen}
        toggle={() =>
          this.setState(
            {
              notificationsOpen: !this.state.notificationsOpen
            },
            () =>
              this.state.notificationsOpen
                ? fetchNotifications()
                : this.props.markAllNotifications()
          )
        }
        triggerComponent={
          <Icon.Badge
            name="notifications"
            size={30}
            badgeCount={this.state.notificationsOpen ? 0 : unreadCount}
          />
        }
        contentClassName={styles.notifications}
      >
        {/* TODO FIXME - do same as the menu element*/}
        {notifications.length ? (
          <div style={{ width: '100%' }}>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {this.renderNotifications(notifications)}
            </div>
          </div>
        ) : (
          <h2 style={{ padding: '10px' }}>Ingen varslinger</h2>
        )}
      </Dropdown>
    );
  }
}
