import { useToastRegion } from '@react-aria/toast';
import { useRef } from 'react';
import { Toast } from 'app/components/Toast/Toast';
import styles from './Toast.module.css';
import type { AriaToastRegionProps } from '@react-aria/toast';
import type { ToastState } from '@react-stately/toast';
import type { ToastContent } from 'app/reducers/toasts';

interface ToastRegionProps extends AriaToastRegionProps {
  state: ToastState<ToastContent>;
}

export const ToastRegion = ({ state, ...props }: ToastRegionProps) => {
  const ref = useRef(null);
  const { regionProps } = useToastRegion(props, state, ref);

  return (
    <div {...regionProps} ref={ref} className={styles.toastRegion}>
      {state.visibleToasts.map((toast) => (
        <Toast key={toast.key} toast={toast} state={state} />
      ))}
    </div>
  );
};
