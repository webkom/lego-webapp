import { Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Check, X } from 'lucide-react';
import {
  Text,
  UNSTABLE_Toast as Toast,
  UNSTABLE_ToastQueue as ToastQueue,
  UNSTABLE_ToastRegion as AriaToastRegion,
  UNSTABLE_ToastContent as ToastContent,
  Button,
} from 'react-aria-components';
import { flushSync } from 'react-dom';
import styles from '~/components/Toast/Toast.module.css';

export type ToastContentType = {
  message: string;
  type?: 'success' | 'error';
};

export const toastQueue = new ToastQueue<ToastContentType>({
  maxVisibleToasts: 5,
  wrapUpdate: (fn) => {
    if ('startViewTransition' in document) {
      document.startViewTransition(() => {
        flushSync(fn);
      });
    } else {
      fn();
    }
  },
});

export const addToast = (toast: ToastContentType & { dismissAfter?: number }) =>
  toastQueue.add(toast, {
    timeout: toast.dismissAfter ?? 5000,
  });

const ToastProvider = () => (
  <AriaToastRegion queue={toastQueue} className={styles.toastRegion}>
    {({ toast }) => (
      <Toast
        style={{ viewTransitionName: toast.key }}
        toast={toast}
        className={cx(
          styles.toast,
          toast.content.type && styles[toast.content.type],
        )}
      >
        <Button slot="close">
          <Icon
            iconNode={toast.content.type === 'success' ? <Check /> : <X />}
            success={toast.content.type === 'success'}
            danger={toast.content.type === 'error'}
            className={!toast.content.type ? styles.defaultIcon : undefined}
            size={18}
          />
        </Button>
        <ToastContent>
          <Text slot="title">{toast.content.message}</Text>
        </ToastContent>
      </Toast>
    )}
  </AriaToastRegion>
);

export default ToastProvider;
