import config from '../config';
import createQueryString from './createQueryString';
import WebSocketClient from 'websocket.js';

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
  const qs = createQueryString({ jwt });
  if (socket) socket.close();
  socket = new WebSocketClient(`${config.wsServerUrl}/${qs}`);
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    dispatch({
      type: data.type,
      payload: data.payload
    });
  };
}
