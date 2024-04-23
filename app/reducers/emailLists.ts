import { createSlice } from '@reduxjs/toolkit';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import { EmailList } from '../actions/ActionTypes';
import type { RootState } from 'app/store/createRootReducer';

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
