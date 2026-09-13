import { createSlice } from '@reduxjs/toolkit';
import { Websockets as WebsocketsAT } from '~/redux/actionTypes';

export type WebsocketsStatus = {
  connected: boolean;
  error: boolean;
};

const STATUS_INITIAL: WebsocketsStatus = {
  connected: false,
  error: false,
};

const STATUS_CONNECTED: WebsocketsStatus = {
  connected: true,
  error: false,
};

const STATUS_ERROR: WebsocketsStatus = {
  connected: false,
  error: true,
};

const websocketsSlice = createSlice({
  name: 'websockets',
  initialState: STATUS_INITIAL,
  reducers: {},
  extraReducers: ({ addCase }) => {
    addCase(WebsocketsAT.CONNECTED, () => STATUS_CONNECTED);
    addCase(WebsocketsAT.CLOSED, () => STATUS_INITIAL);
    addCase(WebsocketsAT.ERROR, () => STATUS_ERROR);
  },
});

export default websocketsSlice.reducer;
