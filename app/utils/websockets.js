import config from '../config';
import createQueryString from './createQueryString';
import { addNotification } from 'app/actions/NotificationActions';

let socket;

export function sendMessage(type, payload) {
  if (socket) {
    if (socket.ws.readyState === 0) {
      socket.onopen = () => {
        socket.send(`${type}:${payload}`);
      };
    } else if (socket.ws.readyState === 1) {
      socket.send(`${type}:${payload}`);
    }
  }
}


export function connectWebsockets(dispatch, jwt) {
  if (!__CLIENT__) {
    return;
  }

  const WebSocketClient = require('websocket.js').default;

  const qs = createQueryString({ jwt });
  if (socket) socket.close();
  socket = new WebSocketClient(`${config.wsServerUrl}/${qs}`);
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    dispatch({
      type: data.type,
      payload: data.payload,
      meta: data.meta
    });
    if (data.meta.errorMessage) {
      dispatch(addNotification({ message: data.meta.errorMessage }));
    }
  };
}
