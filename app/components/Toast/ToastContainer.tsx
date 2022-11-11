import { NotificationObject, NotificationStack } from 'react-notification';
import { removeToast, selectToasts } from 'app/reducers/toasts';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';

const ToastContainer = () => {
  const dispatch = useAppDispatch();
  const toasts: NotificationObject[] = useAppSelector(selectToasts).map(
    (toast) => ({
      dismissAfter: 5000,
      key: toast.id,
      ...toast,
    })
  );

  return (
    <NotificationStack
      notifications={toasts}
      barStyleFactory={toastStyleFactoryInactive}
      activeBarStyleFactory={toastStyleFactory}
      onDismiss={(notification) => dispatch(removeToast(notification.key))}
    />
  );
};

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
      zIndex: 2,
    };
  }

  return { ...style, bottom: `${2 + index * 4}rem`, zIndex: 2 };
}

function toastStyleFactoryInactive(index, style) {
  return toastStyleFactory(index - 1, style);
}

export default ToastContainer;
