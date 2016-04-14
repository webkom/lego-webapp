import React, { Component, PropTypes } from 'react';
import { NotificationStack } from 'react-notification';
import { connect } from 'react-redux';
import { removeNotification } from 'app/actions/NotificationActions';

@connect((state) => ({
  notifications: state.notifications
                .filter((n) => !n.removed)
                .map((n) => {
                  n.key = n.id;
                  return n;
                })
}), { removeNotification })
export default class NotificationContainer extends Component {
  static propTypes = {
    removeNotification: PropTypes.func.isRequired,
    notifications: PropTypes.array.isRequired
  };
  render() {
    return (
      <div>
        <NotificationStack
          dismissAfter={5000}
          notifications={this.props.notifications}
          onDismiss={(notification) => this.props.removeNotification({ id: notification.id })}
        />
      </div>
    );
  }
}
