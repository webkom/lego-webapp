import cx from 'classnames';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import ErrorBoundary from 'app/components/ErrorBoundary';
import Time from 'app/components/Time';
import Dropdown from '../Dropdown';
import { activityRenderers } from '../Feed';
import { toSpan } from '../Feed/context';
import Icon from '../Icon';
import styles from './HeaderNotifications.module.css';

type Props = {
  notificationsData: Record<string, any>;
  fetchNotifications: () => void;
  notifications: Array<Record<string, any>>;
  markAllNotifications: () => Promise<void>;
  fetchNotificationData: () => Promise<void>;
};

type State = {
  notificationsOpen: boolean;
};

const NotificationElement = ({
  notification,
}: {
  notification: Record<string, any>;
}) => {
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

export default class NotificationsDropdown extends Component<Props, State> {
  state = {
    notificationsOpen: false,
  };
  fetch = () => {
    this.props.fetchNotifications();
    this.props.fetchNotificationData();
  };
  renderNotifications = (notifications: Array<Record<string, any>>) => {
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
            },
            () =>
              this.state.notificationsOpen
                ? fetchNotifications()
                : this.props.markAllNotifications()
          )
        }
        closeOnContentClick
        triggerComponent={
          <Icon.Badge
            name="notifications"
            className={styles.notificationBell}
            badgeCount={this.state.notificationsOpen ? 0 : unreadCount}
          />
        }
        contentClassName={styles.notifications}
      >
        {/* TODO FIXME - do same as the menu element*/}
        {notifications.length ? (
          <>{this.renderNotifications(notifications)}</>
        ) : (
          <h2
            style={{
              padding: '10px',
            }}
          >
            Ingen varslinger
          </h2>
        )}
      </Dropdown>
    );
  }
}
