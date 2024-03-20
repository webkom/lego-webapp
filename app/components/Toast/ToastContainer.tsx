import { Component } from 'react';
import { NotificationStack } from 'react-notification';
import { connect } from 'react-redux';
import { removeToast } from 'app/actions/ToastActions';

type Props = {
  removeToast: (arg0: { id: string }) => void;
  toasts: Array<any>;
};

class ToastContainer extends Component<Props> {
  render() {
    const toasts = this.props.toasts.map((toast) => ({
      dismissAfter: 5000,
      // onClick has to be implemented on each object because NotificationStack
      // does not support onClick like it supports onDismiss (see below)
      ...toast,
      key: toast.id,
    }));
    return (
      <NotificationStack
        notifications={toasts}
        barStyleFactory={toastStyleFactoryInactive}
        activeBarStyleFactory={toastStyleFactory}
        onDismiss={(toast) =>
          this.props.removeToast({
            id: toast.id,
          })
        }
      />
    );
  }
}

function toastStyleFactory(index, style) {
  if (__CLIENT__ && window.matchMedia('(max-width: 35em)').matches) {
    return {
      ...style,
      bottom: `${index * 48}px`,
      width: '100%',
      borderRadius: 0,
      left: 0,
      padding: '14px 24px',
      lineHeight: '20px',
      fontSize: '14px',
      boxShadow: 0,
      zIndex: 150,
    };
  }

  return { ...style, bottom: `${2 + index * 4}rem`, zIndex: 150 };
}

function toastStyleFactoryInactive(index, style) {
  return toastStyleFactory(index - 1, style);
}

function mapStateToProps(state) {
  return {
    toasts: state.toasts.items.filter((n) => !n.removed),
  };
}

const mapDispatchToProps = {
  removeToast,
};
export default connect(mapStateToProps, mapDispatchToProps)(ToastContainer);
