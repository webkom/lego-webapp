// @flow

import React, { Component } from 'react';
import { NotificationStack } from 'react-notification';
import { connect } from 'react-redux';
import { removeNotification } from 'app/actions/NotificationActions';

type Props = {
  removeNotification: ({ id: string }) => void,
  notifications: Array<any>
};

class NotificationContainer extends Component {
  props: Props;

  onClick = notification => {
    // For now, we assume the action is "close". In the future, this might be a
    // link to a resource instead
    this.props.removeNotification({ id: notification.id });
  };

  render() {
    const notifications = this.props.notifications.map(notification => ({
      ...notification,
      key: notification.id,
      // onClick has to be implemented on each object because NotificationStack
      // does not support onClick like it supports onDismiss (see below)
      onClick: this.onClick.bind(this, notification),
      dismissAfter: 5000
    }));

    return (
      <NotificationStack
        notifications={notifications}
        barStyleFactory={notificationStyleFactory}
        activeBarStyleFactory={notificationStyleFactory}
        onDismiss={notification => this.props.removeNotification({ id: notification.id })}
      />
    );
  }
}

function notificationStyleFactory(index, style) {
  return {
    ...style,
    bottom: `${8 + index * 4}rem`
  };
}

function mapStateToProps(state) {
  return {
    notifications: state.notifications.items.filter(n => !n.removed)
  };
}

const mapDispatchToProps = { removeNotification };

export default connect(mapStateToProps, mapDispatchToProps)(NotificationContainer);
