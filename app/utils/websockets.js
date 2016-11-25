import config from '../config';
import { User } from '../actions/ActionTypes';

export class WS {
  constructor() {
    this.sock = null;
  }

  onMessage = (dispatch) => (evt) => {
    const msg = JSON.parse(evt.data);
    console.log('WS:', msg);
    dispatch({
      type: msg.type,
      payload: msg.payload
    });
  }

  open = (dispatch, jwt) => {
    dispatch({
      type: User.SOCKET.BEGIN,
    });
    this.sock = new WebSocket(`${config.wsServerUrl}?jwt=${jwt}`);
    if (this.sock.OPEN) {
      this.sock.onmessage = this.onMessage(dispatch);
      dispatch({
        type: User.SOCKET.SUCCESS
      });
    } else {
      dispatch({
        type: User.SOCKET.FAILURE
      });
      this.sock = null;
    }
  }

  close = () => {
    this.sock.close();
    this.sock = null;
  }
}
