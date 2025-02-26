import { createSlice } from '@reduxjs/toolkit';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';
import { addCommentCases } from './comments';
import type { RootState } from '~/redux/rootReducer';

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
