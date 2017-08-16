// @flow
import React, { Component } from 'react';
import cx from 'classnames';
import Dropdown from '../Dropdown';
import Icon from '../Icon';
import { activityRenderers } from '../Feed';
import Time from 'app/components/Time';
import styles from './HeaderNotifications.css';
import { Link } from 'react-router';

type Props = {
  notificationsData: Object,
  fetchNotifications: () => void,
  notifications: Array<Object>,
  markAllNotifications: () => void,
  markNotification: string => void,
  fetchNotificationData: () => void
};

type State = {
  notificationsOpen: boolean
};

const NotificationElement = ({
  notification,
  markNotification
}: {
  notification: Object,
  markNotification: string => void
}) => {
  const renders = activityRenderers[notification.verb];

  if (renders) {
    return (
      <div
        className={cx(
          styles.notification,
          !notification.read ? styles.unRead : null
        )}
        onClick={() => markNotification(notification.id)}
      >
        <div className={styles.innerNotification}>
          <div className={styles.icon}>
            {renders.icon(notification)}
          </div>
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

export default class NotificationsDropdown extends Component {
  props: Props;

  state: State = {
    notificationsOpen: false
  };

  seeAll = () => {
    this.setState({ notificationsOpen: false });
    this.props.markAllNotifications().then(this.fetch);
  };

  markNotification = notificationId => {
    this.setState({ notificationsOpen: false });
    this.props.markNotification(notificationId).then(this.fetch);
  };

  fetch = () => {
    this.props.fetchNotifications();
    this.props.fetchNotificationData();
  };

  renderNotifications = notifications => {
    return (
      <div>
        {notifications.map((notification, i) =>
          <NotificationElement
            key={i}
            notification={notification}
            markNotification={this.markNotification}
          />
        )}
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
            () => (this.state.notificationsOpen ? fetchNotifications() : null)
          )}
        triggerComponent={
          <Icon.Badge name="notifications" badgeCount={unreadCount} />
        }
        contentClassName={styles.notifications}
      >
      {/* TODO FIXME - do same as the menu element*/}
        {notifications.length
          ? <div style={{ width: '100%'}}>
              <div style={{ maxHeight: '300px', overflowY: 'overlay' }}>
                {this.renderNotifications(notifications)}
              </div>
              <div className={styles.seeAllWrapper}>
                <Link onClick={this.seeAll} className={styles.seeAll}>
                  Marker alle som sett
                </Link>
              </div>
            </div>
          : <h2 style={{ padding: '10px' }}>Ingen varslinger</h2>}
      </Dropdown>
    );
  }
}
