import config from '../config';
import createQueryString from './createQueryString';
import WebSocketClient from 'websocket.js';

let socket;

function handleMessage(dispatch, data) {
  dispatch({
    type: data.type,
    payload: data.payload
  });
}


export default function connectWebsockets(dispatch, jwt) {
  const qs = createQueryString({ jwt });
  if (socket) socket.close();
  socket = new WebSocketClient(`${config.wsServerUrl}/${qs}`);
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    handleMessage(dispatch, data);
  };
}
