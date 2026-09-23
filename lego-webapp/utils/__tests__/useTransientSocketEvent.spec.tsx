import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it } from 'vitest';
import useTransientSocketEvent, {
  emitSocketEvent,
  TransientSocketEventTypes,
} from '~/utils/socket/useTransientSocketEvent';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe('useTransientSocketEvent', () => {
  it('calls the handler on emit, and stops after unmount', async () => {
    const received: ({ title: string } | undefined)[] = [];

    const Probe = () => {
      useTransientSocketEvent<{ title: string }>(
        TransientSocketEventTypes.ATTENDANCE_REGISTERED,
        (payload) => received.push(payload),
      );
      return null;
    };

    const root = createRoot(document.createElement('div'));
    await act(async () => {
      root.render(<Probe />);
    });

    emitSocketEvent({
      type: TransientSocketEventTypes.ATTENDANCE_REGISTERED,
      payload: { title: 'hello' },
    });
    expect(received).toEqual([{ title: 'hello' }]);

    await act(async () => {
      root.unmount();
    });

    emitSocketEvent({
      type: TransientSocketEventTypes.ATTENDANCE_REGISTERED,
      payload: { title: 'after unmount' },
    });
    expect(received).toEqual([{ title: 'hello' }]);
  });
});
