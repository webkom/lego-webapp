import { useState } from 'react';
import { WinConfirmModal } from './WinConfirmModal';

type PendingConfirm = {
  title: string;
  message: string;
  onConfirm: () => void | Promise<void>;
};

/**
 * Owns the open/closed state for a single WinConfirmModal, so call sites
 * don't each hand-roll their own boolean + conditional render + reset-on-
 * confirm wiring. Call this once at the top of a component (it's a hook),
 * then call the returned requestConfirm(...) from an event handler with
 * whatever title/message/onConfirm are current at that moment - this is
 * what lets a caller inside a render-prop (where hooks can't be called)
 * still show a dialog built from live values.
 */
export const useConfirmDialog = () => {
  const [pending, setPending] = useState<PendingConfirm | null>(null);

  const dialog = pending ? (
    <WinConfirmModal
      title={pending.title}
      message={pending.message}
      onConfirm={async () => {
        await pending.onConfirm();
        setPending(null);
      }}
      onCancel={() => setPending(null)}
    />
  ) : null;

  const requestConfirm = (
    title: string,
    message: string,
    onConfirm: () => void | Promise<void>,
  ) => setPending({ title, message, onConfirm });

  return { requestConfirm, dialog };
};
