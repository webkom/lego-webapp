import { createSlice } from '@reduxjs/toolkit';
import { Emoji } from '~/redux/actionTypes';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';
import type { RootState } from '~/redux/rootReducer';

const legoAdapter = createLegoAdapter(EntityType.Emojis, {
  selectId: (emoji) => emoji.shortCode,
});

const emojisSlice = createSlice({
  name: EntityType.Emojis,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [Emoji.FETCH, Emoji.FETCH_ALL],
  }),
});

export default emojisSlice.reducer;
export const { selectAll: selectEmojis } = legoAdapter.getSelectors<RootState>(
  (state) => state.emojis,
);
