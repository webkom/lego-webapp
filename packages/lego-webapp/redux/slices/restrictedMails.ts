import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment-timezone';
import { RestrictedMail } from '~/redux/actionTypes';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';
import type { RootState } from '~/redux/rootReducer';

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
} = legoAdapter.getSelectors((state: RootState) => state.restrictedMails);
