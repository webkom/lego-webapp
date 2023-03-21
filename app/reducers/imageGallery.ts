import produce from 'immer';
import { createSelector } from 'reselect';
import createEntityReducer, { fetching } from 'app/utils/createEntityReducer';
import { ImageGallery, File } from '../actions/ActionTypes';

export default createEntityReducer({
  key: 'imageGallery',
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
  /*   schema: imageGallerySchema,
  fetching: fetching(ImageGallery.FETCH_ALL),
 */
});
export const selectImageGalleries = createSelector(
  (state) => state.imageGallery.byId,
  (state) => state.imageGallery.items,
  (imageGalleryById, imageGalleryIds) =>
    imageGalleryIds.map((id) => imageGalleryById[id])
);
