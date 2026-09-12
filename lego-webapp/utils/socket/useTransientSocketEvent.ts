import { useEffect, useRef } from 'react';

export enum TransientSocketEventTypes {
  ATTENDANCE_REGISTERED = 'Websockets.TRANSIENT.ATTENDANCE_REGISTERED',
}

type SocketMeta = Record<string, unknown>;

type SocketEvent<T> = {
  type: string;
  payload?: T;
  meta?: SocketMeta;
};

const socketEventBus = new EventTarget();

export const emitSocketEvent = <T>(event: SocketEvent<T>) => {
  socketEventBus.dispatchEvent(new CustomEvent(event.type, { detail: event }));
};

/**
 * Registers a handler for a transient websocket event.
 *
 * Should not be used to handle data/state, use normal redux state management instead.
 * This is explicitly for transient events that should not persist state eg. live one-off effects.
 *
 * @param type The type of the transient event to listen for.
 * @param handler The function to call when the event is recieved.
 */
export const useTransientSocketEvent = <T>(
  type: TransientSocketEventTypes,
  handler: (payload?: T, meta?: SocketMeta) => void,
) => {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const listener = (event: Event) => {
      const { payload, meta } = (event as CustomEvent<SocketEvent<T>>).detail;
      handlerRef.current(payload, meta);
    };

    socketEventBus.addEventListener(type, listener);
    return () => socketEventBus.removeEventListener(type, listener);
  }, [type]);
};

export default useTransientSocketEvent;
