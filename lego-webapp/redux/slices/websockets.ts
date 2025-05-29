import { createSlice } from '@reduxjs/toolkit';
import { Websockets as WebsocketsAT } from '../actionTypes';
import { Websockets, WebsocketsGroup } from '../models/Websockets';
import { EntityType } from '../models/entities';

const GROUP_STATUS_INITIAL = {
  connected: false,
  pending: false,
  error: false,
};

export const GROUP_STATUS_PENDING = {
  ...GROUP_STATUS_INITIAL,
  pending: true,
};

const GROUP_STATUS_CONNECTED = {
  ...GROUP_STATUS_INITIAL,
  connected: true,
};

export const GROUP_STATUS_ERROR = {
  ...GROUP_STATUS_INITIAL,
  error: true,
};

const initialState: Websockets = {
  status: {
    connected: false,
    error: false,
  },
  groups: [] as WebsocketsGroup[],
};

const websocketsSlice = createSlice({
  name: EntityType.Websockets,
  initialState,
  reducers: {},
  extraReducers: ({ addCase }) => {
    addCase(WebsocketsAT.CONNECTED, (state) => {
      state.status.connected = true;
    });
    addCase(WebsocketsAT.CLOSED, (state) => {
      state.status.connected = false;
    });
    addCase(WebsocketsAT.ERROR, (state) => {
      state.status.error = true;
    });
    addCase(WebsocketsAT.GROUP_JOIN.BEGIN, (state, action) => {
      if (!setGroupStatus(state, action, GROUP_STATUS_PENDING))
        state.groups.push({
          group: action.payload.group,
          status: GROUP_STATUS_PENDING,
        });
    });
    addCase(WebsocketsAT.GROUP_JOIN.SUCCESS, (state, action) => {
      setGroupStatus(state, action, GROUP_STATUS_CONNECTED);
    });
    addCase(WebsocketsAT.GROUP_JOIN.FAILURE, (state, action) => {
      setGroupStatus(state, action, GROUP_STATUS_ERROR);
    });
    addCase(WebsocketsAT.GROUP_LEAVE.BEGIN, (state, action) => {
      setGroupStatus(state, action, GROUP_STATUS_PENDING);
    });
    addCase(WebsocketsAT.GROUP_LEAVE.SUCCESS, (state, action) => {
      setGroupStatus(state, action, GROUP_STATUS_INITIAL);
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
