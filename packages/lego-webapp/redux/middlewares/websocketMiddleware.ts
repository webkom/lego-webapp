import WebSocketClient from '@gamestdio/websocket';
import createQueryString from 'app/utils/createQueryString';
import { User, Event } from '~/redux/actionTypes';
import { fetchFollowers } from '~/redux/actions/EventActions';
import { selectCurrentUser } from '~/redux/slices/auth';
import { addToast } from '~/redux/slices/toasts';
import { appConfig } from '~/utils/appConfig';
import type { Middleware } from '@reduxjs/toolkit';

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
          dispatch(
            addToast({
              message,
              type: meta.successMessage
                ? 'success'
                : meta.errorMessage
                  ? 'error'
                  : undefined,
            }),
          );
        }
      };

      socket.onopen = () => {
        dispatch({
          type: 'WS_CONNECTED',
        });
      };

      socket.onclose = () => {
        dispatch({
          type: 'WS_CLOSED',
        });
      };

      socket.onerror = () => {
        dispatch({
          type: 'WS_ERROR',
        });
      };
    };

    return (next) => (action) => {
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

      return next(action);
    };
  };
};

export default createWebSocketMiddleware;
