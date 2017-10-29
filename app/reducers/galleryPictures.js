// @flow

import { createSelector } from 'reselect';
import { GalleryPicture } from 'app/actions/ActionTypes';
import { mutateComments } from 'app/reducers/comments';
import createEntityReducer from 'app/utils/createEntityReducer';

export type GalleryPictureEntity = {
  id: number,
  title: string,
  galleryId: number,
  description: string,
  text: string,
  comments: Array<number>
};

const mutate = mutateComments('galleryPictures');

export default createEntityReducer({
  key: 'galleryPictures',
  types: {
    fetch: GalleryPicture.FETCH
  },
  mutate
});

export const SelectGalleryPicturesByGalleryId = createSelector(
  state => state.galleryPictures.byId,
  (state, props) => props.galleryId,
  (galleryPicturesById, galleryId) =>
    Object.keys(galleryPicturesById)
      .map(id => galleryPicturesById[id])
      .filter(galleryPicture => galleryPicture.gallery === parseInt(galleryId))
);

export const selectGalleryPictureById = createSelector(
  state => state.galleryPictures.byId,
  (state, props) => props.pictureId,
  (picturesById, pictureId) => picturesById[pictureId]
);

export const selectCommentsForGalleryPicture = createSelector(
  selectGalleryPictureById,
  state => state.comments.byId,
  (picture, commentsById) => {
    if (!picture) return [];
    return (picture.comments || []).map(commentId => commentsById[commentId]);
  }
);
