// @flow

import { createSelector } from 'reselect';
import { GalleryPicture } from 'app/actions/ActionTypes';
import { mutateComments } from 'app/reducers/comments';
import joinReducers from 'app/utils/joinReducers';
import createEntityReducer from 'app/utils/createEntityReducer';

export type GalleryPictureEntity = {
  id: number,
  title: string,
  gallery: number,
  description: string,
  text: string,
  comments: Array<number>
};

function mutateGalleryPicture(state: any, action: any) {
  switch (action.type) {
    case GalleryPicture.DELETE.SUCCESS: {
      return {
        ...state,
        items: state.items.filter(id => id !== action.meta.id)
      };
    }
    default:
      return state;
  }
}

const mutate = joinReducers(
  mutateComments('galleryPictures'),
  mutateGalleryPicture
);

export default createEntityReducer({
  key: 'galleryPictures',
  types: {
    fetch: GalleryPicture.FETCH
  },
  mutate
});

export const SelectGalleryPicturesByGalleryId = createSelector(
  state => state.galleryPictures.byId,
  state => state.galleryPictures.items,
  (state, props) => props.galleryId,
  (galleryPicturesById, galleryPictureIds, galleryId) =>
    galleryPictureIds
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
