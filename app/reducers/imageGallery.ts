import { createSelector } from 'reselect';
import createEntityReducer, { fetching } from 'app/utils/createEntityReducer';
import { ImageGallery } from '../actions/ActionTypes';
import { imageGallerySchema } from '.';

export default createEntityReducer({
  key: 'imageGallery',
  types: {
    fetch: ImageGallery.FETCH_ALL,
  },
  schema: imageGallerySchema,
  fetching: fetching(ImageGallery.FETCH_ALL),
});
export const selectImageGalleries = createSelector(
  (state) => state.imageGallery.byId,
  (state) => state.imageGallery.items,
  (imageGalleryById, imageGalleryIds) =>
    imageGalleryIds.map((id) => imageGalleryById[id])
);
