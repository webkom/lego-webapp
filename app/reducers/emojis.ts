import { createSelector } from 'reselect';
import { Emoji } from 'app/actions/ActionTypes';
import type { ID } from 'app/models';
import createEntityReducer from 'app/utils/createEntityReducer';

export type EmojiEntity = {
  shortCode: string;
  keywords: Array<string>;
  unicodeString: string;
  fitzpatrickScale: boolean;
  category: string;
  hasReacted?: boolean;
  reactionId?: ID;
};
export const selectEmojis = createSelector(
  (state) => state.emojis.byId,
  (state) => state.emojis.items,
  (emojisById, emojiIds) => {
    return emojiIds.map((id) => emojisById[id]);
  }
);
export const selectEmojisById = createSelector(
  selectEmojis,
  (state, emojisId) => emojisId,
  (emojis, emojisId) => {
    if (!emojis || !emojisId) return {};
    return emojis.find((emojis) => emojis.shortCode === emojisId);
  }
);
export default createEntityReducer({
  key: 'emojis',
  types: {
    fetch: [Emoji.FETCH, Emoji.FETCH_ALL],
  },
});
