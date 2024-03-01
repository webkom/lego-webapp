import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment-timezone';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import { RestrictedMail } from '../actions/ActionTypes';
import type { RootState } from 'app/store/createRootReducer';

export type RestrictedMailEntity = {
  id: number;
  fromAddress: string;
  hideAddress: boolean;
  used: boolean;
  users: Array<number>;
  groups: Array<number>;
  events: Array<number>;
  meetings: Array<number>;
  rawAddresses: Array<string>;
};

const legoAdapter = createLegoAdapter(EntityType.RestrictedMails, {
  sortComparer: (a, b) => moment(b.createdAt).diff(moment(a.createdAt)),
});

const restrictedMailSlice = createSlice({
  name: EntityType.RestrictedMails,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [RestrictedMail.FETCH],
  }),
});

export default restrictedMailSlice.reducer;

export const {
  selectAll: selectRestrictedMails,
  selectById: selectRestrictedMailById,
} = legoAdapter.getSelectors<RootState>((state) => state.restrictedMails);
