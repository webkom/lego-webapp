import WebSocketClient from '@gamestdio/websocket';
import { addToast } from '~/components/Toast/ToastProvider';
import { User, Event, Websockets as WebsocketsAT } from '~/redux/actionTypes';
import { fetchFollowers } from '~/redux/actions/EventActions';
import { selectCurrentUser } from '~/redux/slices/auth';
import { appConfig } from '~/utils/appConfig';
import createQueryString from '~/utils/createQueryString';
import type { Middleware, UnknownAction } from '@reduxjs/toolkit';

const createWebSocketMiddleware = (): Middleware => {
  let socket: WebSocketClient | null = null;
  return ({ getState, dispatch }) => {
    const makeSocket = (jwt: string) => {
      if (socket || !jwt) return;
      const qs = createQueryString({
        jwt,
      });
      socket = new WebSocketClient(`${appConfig.wsServerUrl}/${qs}`);

      socket.onmessage = (event) => {
        const { type, payload, meta: socketMeta } = JSON.parse(event.data);
        const meta = {
          ...socketMeta,
          currentUser: selectCurrentUser(getState()),
        };

        if (
          type === Event.SOCKET_REGISTRATION.SUCCESS &&
          (payload.user && payload.user.id) === meta.currentUser.id
        ) {
          dispatch(fetchFollowers(meta.eventId, meta.currentUser.id));
        }

        dispatch({
          type,
          payload,
          meta,
        });
        const message = meta.successMessage || meta.errorMessage;

        if (message) {
          addToast({
            message,
            type: meta.successMessage
              ? 'success'
              : meta.errorMessage
                ? 'error'
                : undefined,
          });
        }
      };

      socket.onopen = () => {
        dispatch({
          type: WebsocketsAT.CONNECTED,
        });
      };

      socket.onclose = () => {
        dispatch({
          type: WebsocketsAT.CLOSED,
        });
      };

      socket.onerror = () => {
        dispatch({
          type: WebsocketsAT.ERROR,
        });
      };
    };

    return (next) => (action: UnknownAction) => {
      if (action.type === 'REHYDRATED') {
        makeSocket(getState().auth.token);
        return next(action);
      }

      if (action.type === User.LOGIN.SUCCESS) {
        makeSocket(action.payload.token);
        return next(action);
      }

      if (action.type === User.LOGOUT) {
        if (socket) {
          socket.close();
        }

        socket = null;
        return next(action);
      }
      
      if (socket && socket.readyState === 1) {
        switch (action.type) {
          case WebsocketsAT.GROUP_JOIN.BEGIN:
          case WebsocketsAT.GROUP_LEAVE.BEGIN:
            socket.send(JSON.stringify({
              type: action.type,
              payload: action.payload
            }));
        }
        return next(action);
      }

      return next(action);
    };
  };
};

export default createWebSocketMiddleware;
