import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { Tag } from 'app/actions/ActionTypes';
import { selectPaginationNext } from 'app/reducers/selectors';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import type { RootState } from 'app/store/createRootReducer';

const legoAdapter = createLegoAdapter(EntityType.Tags, {
  selectId: (tag) => tag.tag,
});

const tagsSlice = createSlice({
  name: EntityType.Tags,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [Tag.FETCH],
  }),
});

export default tagsSlice.reducer;

export const {
  selectAll: selectAllTags,
  selectAllPaginated: selectPaginatedTags,
  selectById: selectTagById,
} = legoAdapter.getSelectors((state: RootState) => state.tags);

export const selectPopularTags = createSelector(
  (state: RootState) => state,
  selectPaginationNext({
    endpoint: '/tags/popular/',
    query: {},
    entity: EntityType.Tags,
  }),
  (state, pagination) => selectPaginatedTags(state, pagination),
);
