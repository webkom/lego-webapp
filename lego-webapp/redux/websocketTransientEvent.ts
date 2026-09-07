import { useEffect, useRef } from 'react';
import { Websockets as WebsocketsAT } from '~/redux/actionTypes';

type SocketTransientEventType = typeof WebsocketsAT.TRANSIENT[keyof typeof WebsocketsAT.TRANSIENT];

const socketEventBus = new EventTarget();

export const dispatchSocketTransientEvent = (type: SocketTransientEventType, payload: unknown) => {
  socketEventBus.dispatchEvent(new CustomEvent(type, { detail: payload }));
};

const subscribeSocketTransientEvent = <T>(
  type: SocketTransientEventType,
  handler: (payload: T) => void,
) => {
  const listener = (event: Event) => handler((event as CustomEvent<T>).detail);
  socketEventBus.addEventListener(type, listener);
  return () => socketEventBus.removeEventListener(type, listener);
};

export const useSocketTransientEvent = <T>(type: SocketTransientEventType, handler: (payload: T) => void) => {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(
    () => subscribeSocketTransientEvent<T>(type, (payload) => handlerRef.current(payload)),
    [type],
  );
};
