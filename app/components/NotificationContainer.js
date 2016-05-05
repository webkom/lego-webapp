import React, { Component, PropTypes } from 'react';
import { NotificationStack } from 'react-notification';
import { connect } from 'react-redux';
import { removeNotification } from 'app/actions/NotificationActions';

@connect((state) => ({
  notifications: state.notifications.items
                .filter((n) => !n.removed)
}), { removeNotification })
export default class NotificationContainer extends Component {
  static propTypes = {
    removeNotification: PropTypes.func.isRequired,
    notifications: PropTypes.array.isRequired
  };
  onClick = (notification) => {
    // For now, we assume the action is "close". In the future, this might be a
    // link to a resource instead
    this.props.removeNotification({ id: notification.id });
  };
  render() {
    const notifications = this.props.notifications.map((n) => {
      n.key = n.id;
      // onClick has to be implemented on each object because NotificationStack
      // does not support onClick like it supports onDismiss (see below)
      n.onClick = this.onClick.bind(this, n);
      return n;
    });
    return (
      <NotificationStack
        dismissAfter={5000}
        notifications={notifications}
        onDismiss={(notification) => this.props.removeNotification({ id: notification.id })}
      />
    );
  }
}
