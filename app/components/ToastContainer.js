// @flow

import React, { Component } from 'react';
import { NotificationStack } from 'react-notification';
import { connect } from 'react-redux';
import { removeToast } from 'app/actions/ToastActions';

type Props = {
  removeToast: ({ id: string }) => void,
  toasts: Array<any>
};

class ToastContainer extends Component<Props> {
  onClick = toast => {
    // For now, we assume the action is "close". In the future, this might be a
    // link to a resource instead
    this.props.removeToast({ id: toast.id });
  };

  render() {
    const toasts = this.props.toasts.map(toast => ({
      ...toast,
      key: toast.id,
      // onClick has to be implemented on each object because NotificationStack
      // does not support onClick like it supports onDismiss (see below)
      onClick: this.onClick.bind(this, toast),
      dismissAfter: 5000
    }));

    return (
      <NotificationStack
        notifications={toasts}
        barStyleFactory={toastStyleFactory}
        activeBarStyleFactory={toastStyleFactory}
        onDismiss={toast => this.props.removeToast({ id: toast.id })}
      />
    );
  }
}

function toastStyleFactory(index, style) {
  return {
    ...style,
    bottom: `${8 + index * 4}rem`
  };
}

function mapStateToProps(state) {
  return {
    toasts: state.toasts.items.filter(n => !n.removed)
  };
}

const mapDispatchToProps = { removeToast };

export default connect(mapStateToProps, mapDispatchToProps)(ToastContainer);
