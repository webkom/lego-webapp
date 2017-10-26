// @flow
import React, { Component } from 'react';
import cx from 'classnames';
import Dropdown from '../Dropdown';
import Icon from '../Icon';
import { activityRenderers } from '../Feed';
import Time from 'app/components/Time';
import styles from './HeaderNotifications.css';

type Props = {
  notificationsData: Object,
  fetchNotifications: () => void,
  notifications: Array<Object>,
  markAllNotifications: () => Promise<void>,
  markNotification: number => Promise<void>,
  fetchNotificationData: () => Promise<void>
};

type State = {
  notificationsOpen: boolean
};

const NotificationElement = ({
  notification,
  markNotification
}: {
  notification: Object,
  markNotification: number => void
}) => {
  const renders = activityRenderers[notification.verb];

  if (renders) {
    return (
      <div
        className={cx(
          styles.notification,
          !notification.read ? styles.unRead : null
        )}
        onClick={() => this.props.markNotification(notification.id)}
      >
        <div className={styles.innerNotification}>
          <div className={styles.icon}>{renders.icon(notification)}</div>
          <div>
            {renders.activityHeader(notification)}
            <Time
              time={notification.updatedAt}
              wordsAgo
              style={{ margin: '0', display: 'block' }}
            />
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default class NotificationsDropdown extends Component<Props, State> {
  state: State = {
    notificationsOpen: false,
    hideUnreadCount: false
  };

  seeAll = () => {
    this.setState({ notificationsOpen: false });
    this.props.markAllNotifications().then(this.fetch);
  };

  markNotification = (notificationId: number) => {
    this.setState({ notificationsOpen: false });
    this.props.markNotification(notificationId).then(this.fetch);
  };

  fetch = () => {
    this.props.fetchNotifications();
    this.props.fetchNotificationData();
  };

  renderNotifications = (notifications: Array<Object>) => {
    return (
      <div>
        {notifications.map((notification, i) => (
          <NotificationElement
            key={i}
            notification={notification}
            markNotification={this.markNotification}
          />
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
              notificationsOpen: !this.state.notificationsOpen,
              hideUnreadCount: true
            },
            () =>
              this.state.notificationsOpen
                ? fetchNotifications()
                : this.props.markAllNotifications().then(this.fetch)
          )}
        triggerComponent={
          <Icon.Badge
            name="notifications"
            size={30}
            badgeCount={!this.state.hideUnreadCount && unreadCount}
          />
        }
        contentClassName={styles.notifications}
      >
        {/* TODO FIXME - do same as the menu element*/}
        {notifications.length ? (
          <div style={{ width: '100%' }}>
            <div style={{ maxHeight: '300px', overflowY: 'overlay' }}>
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
