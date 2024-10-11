import { useToast } from '@react-aria/toast';
import { Icon } from '@webkom/lego-bricks';
import { X } from 'lucide-react';
import { useRef } from 'react';
import styles from './Toast.module.css';
import type { AriaToastProps } from '@react-aria/toast';
import type { ToastState } from '@react-stately/toast';

interface ToastProps extends AriaToastProps<string> {
  state: ToastState<string>;
}

export const Toast = ({ state, ...props }: ToastProps) => {
  const ref = useRef(null);
  const { toastProps, contentProps, titleProps, closeButtonProps } = useToast(
    props,
    state,
    ref,
  );

  return (
    <div
      {...toastProps}
      ref={ref}
      className={styles.toast}
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
        className={styles.closeButton}
        iconNode={<X />}
        size={18}
      />
      <div {...contentProps}>
        <div {...titleProps}>{props.toast.content}</div>
      </div>
    </div>
  );
};
