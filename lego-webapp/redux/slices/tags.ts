import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { Tag } from '~/redux/actionTypes';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';
import { selectPaginationNext } from '~/redux/slices/selectors';
import type { RootState } from '~/redux/rootReducer';

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
