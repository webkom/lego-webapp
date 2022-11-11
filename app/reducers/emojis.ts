import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { fetchEmojis, fetchEmoji } from 'app/actions/EmojiActions';
import type { ID } from 'app/store/models';
import type Emoji from 'app/store/models/Emoji';
import { EntityType } from 'app/store/models/Entities';
import type { RootState } from 'app/store/rootReducer';
import addEntityReducer, {
  EntityReducerState,
  getInitialEntityReducerState,
} from 'app/store/utils/entityReducer';

export type EmojiEntity = Emoji;

export type EmojisState = EntityReducerState<Emoji>;

const initialState: EmojisState = getInitialEntityReducerState();

const emojisSlice = createSlice({
  name: EntityType.Emojis,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    addEntityReducer(builder, EntityType.Emojis, {
      fetch: [fetchEmojis, fetchEmoji],
    });
  },
});

export default emojisSlice.reducer;

export const selectEmojis = createSelector(
  (state: RootState) => state.emojis.byId,
  (state: RootState) => state.emojis.items,
  (emojisById, emojiIds) => {
    return emojiIds.map((id) => emojisById[id]);
  }
);

export const selectEmojisById = createSelector(
  selectEmojis,
  (_: RootState, emojisId: ID) => emojisId,
  (emojis, emojisId) => {
    if (!emojis || !emojisId) return;
    return emojis.find((emojis) => emojis.shortCode === emojisId);
  }
);
