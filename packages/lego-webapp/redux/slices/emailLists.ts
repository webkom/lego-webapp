import { createSlice } from '@reduxjs/toolkit';
import { EmailList } from '~/redux/actionTypes';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';
import type { RootState } from '~/redux/rootReducer';

const legoAdapter = createLegoAdapter(EntityType.EmailLists);

const emailListSlice = createSlice({
  name: EntityType.EmailLists,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [EmailList.FETCH],
  }),
});

export default emailListSlice.reducer;
export const {
  selectAllPaginated: selectEmailLists,
  selectById: selectEmailListById,
} = legoAdapter.getSelectors<RootState>((state) => state.emailLists);
