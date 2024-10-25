import { useToastState } from '@react-stately/toast';
import { useEffect } from 'react';
import { ToastRegion } from 'app/components/Toast/ToastRegion';
import { removeToast, selectToasts } from 'app/reducers/toasts';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import usePrevious from 'app/utils/usePrevious';

const ToastProvider = () => {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector(selectToasts);
  const previousToasts = usePrevious(toasts);

  const toastState = useToastState<string>({
    maxVisibleToasts: 5,
    hasExitAnimation: true,
  });

  // sync toastState with redux state
  useEffect(() => {
    const previous = previousToasts || [];

    for (const toast of toasts) {
      if (!previous.find((t) => t.id === toast.id)) {
        toastState.add(toast.message, {
          timeout: toast.dismissAfter,
          onClose: () => dispatch(removeToast(toast.id)),
        });
      }
    }
  }, [dispatch, previousToasts, toastState, toasts]);

  return toastState.visibleToasts.length ? (
    <ToastRegion state={toastState} />
  ) : null;
};

export default ToastProvider;