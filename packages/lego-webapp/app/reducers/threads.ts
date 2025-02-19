import { createSlice } from '@reduxjs/toolkit';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import { addCommentCases } from './comments';
import type { RootState } from 'app/store/createRootReducer';

const legoAdapter = createLegoAdapter(EntityType.Thread);

const threadsSlice = createSlice({
  name: EntityType.Thread,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    extraCases: (addCase) => {
      addCommentCases(EntityType.Articles, addCase);
    },
  }),
});

export default threadsSlice.reducer;

export const {
  selectById: selectThreadById,
  selectByField: selectThreadsByField,
} = legoAdapter.getSelectors((state: RootState) => state.threads);

export const selectThreadsByForumId = selectThreadsByField('forum');
