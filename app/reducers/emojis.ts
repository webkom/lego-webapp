import { createSlice } from '@reduxjs/toolkit';
import { Emoji } from 'app/actions/ActionTypes';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import type { RootState } from 'app/store/createRootReducer';

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
  (state) => state.emojis
);
