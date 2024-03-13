import WebSocketClient from 'websocket.js';
import { User, Event } from 'app/actions/ActionTypes';
import { isUserFollowing } from 'app/actions/EventActions';
import { addToast } from 'app/actions/ToastActions';
import config from 'app/config';
import { selectCurrentUser } from 'app/reducers/auth';
import createQueryString from 'app/utils/createQueryString';
import type { Middleware } from '@reduxjs/toolkit';
import type { RootState } from 'app/store/createRootReducer';
import type { AppDispatch } from 'app/store/createStore';

const createWebSocketMiddleware = (): Middleware<
  Record<string, never>,
  RootState,
  AppDispatch
> => {
  let socket = null;
  return ({ getState, dispatch }) => {
    const makeSocket = (jwt) => {
      if (socket || !jwt) return;
      const qs = createQueryString({
        jwt,
      });
      socket = new WebSocketClient(`${config.wsServerUrl}/${qs}`);

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
          dispatch(isUserFollowing(meta.eventId));
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
            })
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
