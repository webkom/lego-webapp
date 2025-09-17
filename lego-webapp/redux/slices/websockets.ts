import { createSlice } from '@reduxjs/toolkit';
import { Websockets as WebsocketsAT } from '../actionTypes';
import { Websockets, WebsocketsGroup } from '../models/Websockets';
import { EntityType } from '../models/entities';

const STATUS_INITIAL = {
  connected: false,
  pending: false,
  error: false,
};

const STATUS_CONNECTED = {
  ...STATUS_INITIAL,
  connected: true,
};

export const STATUS_PENDING = {
  ...STATUS_INITIAL,
  pending: true,
};

export const STATUS_ERROR = {
  ...STATUS_INITIAL,
  error: true,
};

const initialState: Websockets = {
  status: STATUS_INITIAL,
  groups: [] as WebsocketsGroup[],
};

const websocketsSlice = createSlice({
  name: EntityType.Websockets,
  initialState,
  reducers: {},
  extraReducers: ({ addCase }) => {
    addCase(WebsocketsAT.CONNECTED, (state) => {
      state.status = STATUS_CONNECTED;
    });
    addCase(WebsocketsAT.CLOSED, (state) => {
      state.status = STATUS_INITIAL;
      state.groups = []
    });
    addCase(WebsocketsAT.ERROR, (state) => {
      state.status = STATUS_ERROR;
      state.groups = []
    });
    addCase(WebsocketsAT.GROUP_JOIN.BEGIN, (state, action) => {
      if (!setGroupStatus(state, action, STATUS_PENDING))
        state.groups.push({
          group: action.payload.group,
          status: STATUS_PENDING,
        });
    });
    addCase(WebsocketsAT.GROUP_JOIN.SUCCESS, (state, action) => {
      setGroupStatus(state, action, STATUS_CONNECTED);
    });
    addCase(WebsocketsAT.GROUP_JOIN.FAILURE, (state, action) => {
      setGroupStatus(state, action, STATUS_ERROR);
    });
    addCase(WebsocketsAT.GROUP_LEAVE.BEGIN, (state, action) => {
      setGroupStatus(state, action, STATUS_PENDING);
    });
    addCase(WebsocketsAT.GROUP_LEAVE.SUCCESS, (state, action) => {
      setGroupStatus(state, action, STATUS_INITIAL);
    });
  },
});

const setGroupStatus = (state, action, status): boolean => {
  const group = state.groups.find(
    (item) => item.group === action.payload.group,
  );
  if (group) {
    group.status = status;
    return true;
  }
  return false;
};

export default websocketsSlice.reducer;
