import { produce } from 'immer';
import { createSelector } from 'reselect';
import createEntityReducer from 'app/utils/createEntityReducer';
import { ImageGallery, File } from '../actions/ActionTypes';

export default createEntityReducer({
  key: 'imageGalleryEntries',
  types: {
    fetch: ImageGallery.FETCH_ALL,
  },
  mutate: (state, action) => {
    switch (action.type) {
      case File.PATCH.SUCCESS:
        if (action.meta.body?.save_for_use === false) {
          return produce(state, (draft) => {
            draft.items = draft.items.filter((id) => id !== action.meta.id);
          });
        }
        break;
    }
    return state;
  },
});
export const selectImageGalleryEntries = createSelector(
  (state) => state.imageGalleryEntries.byId,
  (state) => state.imageGalleryEntries.items,
  (imageGalleryEntriesById, imageGalleryEntriesIds) =>
    imageGalleryEntriesIds.map((id) => imageGalleryEntriesById[id]),
);
