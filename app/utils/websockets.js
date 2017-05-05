import WebSocketClient from 'websocket.js';
import config from '../config';
import createQueryString from './createQueryString';
import { addNotification } from 'app/actions/NotificationActions';
import { User } from 'app/actions/ActionTypes';

export default function createWebSocketMiddleware() {
  let socket = null;

  return store => {
    const makeSocket = jwt => {
      if (socket || !jwt) return;

      const qs = createQueryString({ jwt });
      socket = new WebSocketClient(`${config.wsServerUrl}/${qs}`);

      socket.onmessage = event => {
        const { type, payload, meta } = JSON.parse(event.data);
        store.dispatch({ type, payload, meta });
        if (meta.errorMessage) {
          store.dispatch(addNotification({ message: meta.errorMessage }));
        }
      };

      socket.onopen = () => {
        store.dispatch({ type: 'WS_CONNECTED' });
      };

      socket.onclose = () => {
        store.dispatch({ type: 'WS_CLOSED' });
      };

      socket.onerror = () => {
        store.dispatch({ type: 'WS_ERROR' });
      };
    };

    return next => action => {
      if (action.type === 'REHYDRATED') {
        makeSocket(store.getState().auth.token);
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
}
