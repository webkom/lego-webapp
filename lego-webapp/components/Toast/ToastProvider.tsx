import { useToastState } from '@react-stately/toast';
import { useEffect } from 'react';
import { ToastRegion } from '~/components/Toast/ToastRegion';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { removeToast, selectToasts } from '~/redux/slices/toasts';
import usePrevious from '~/utils/usePrevious';
import type { ToastContent } from '~/redux/slices/toasts';

const ToastProvider = () => {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector(selectToasts);
  const previousToasts = usePrevious(toasts);

  const toastState = useToastState<ToastContent>({
    maxVisibleToasts: 5,
    hasExitAnimation: true,
  });

  // sync toastState with redux state
  useEffect(() => {
    const previous = previousToasts || [];

    for (const toast of toasts) {
      if (!previous.find((t) => t.id === toast.id)) {
        toastState.add(
          { message: toast.message, type: toast.type },
          {
            timeout: toast.dismissAfter,
            onClose: () => dispatch(removeToast(toast.id)),
          },
        );
      }
    }
  }, [dispatch, previousToasts, toastState, toasts]);

  return toastState.visibleToasts.length ? (
    <ToastRegion state={toastState} />
  ) : null;
};

export default ToastProvider;
