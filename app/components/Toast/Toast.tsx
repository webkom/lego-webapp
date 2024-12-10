import { useToast } from '@react-aria/toast';
import { Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Check, X } from 'lucide-react';
import { useRef } from 'react';
import styles from './Toast.module.css';
import type { AriaToastProps } from '@react-aria/toast';
import type { ToastState } from '@react-stately/toast';
import type { ToastContent } from 'app/reducers/toasts';

interface ToastProps extends AriaToastProps<ToastContent> {
  state: ToastState<ToastContent>;
}

export const Toast = ({ state, ...props }: ToastProps) => {
  const ref = useRef(null);
  const { toastProps, contentProps, titleProps, closeButtonProps } = useToast(
    props,
    state,
    ref,
  );

  const { message, type } = props.toast.content;

  return (
    <div
      {...toastProps}
      ref={ref}
      className={cx(styles.toast, type && styles[type])}
      // Use a data attribute to trigger animations in CSS.
      data-animation={props.toast.animation}
      onAnimationEnd={() => {
        // Remove the toast when the exiting animation completes.
        if (props.toast.animation === 'exiting') {
          state.remove(props.toast.key);
        }
      }}
    >
      <Icon
        {...closeButtonProps}
        iconNode={type === 'success' ? <Check /> : <X />}
        success={type === 'success'}
        danger={type === 'error'}
        className={!type ? styles.defaultIcon : undefined}
        size={18}
      />
      <div {...contentProps}>
        <div {...titleProps}>{message}</div>
      </div>
    </div>
  );
};
