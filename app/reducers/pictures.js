// @flow

import { Gallery } from '../actions/ActionTypes';
import { createSelector } from 'reselect';
import { mutateComments } from 'app/reducers/comments';
import createEntityReducer from 'app/utils/createEntityReducer';

/**
 * Used by the individual entity reducers
 */

const mutate = mutateComments('pictures');

export function mutatePictures() {
  return (state: any, action: any) => {
    switch (action.type) {
      case Gallery.ADD_PICTURE.SUCCESS: {
        if (!action.meta.galleryId) {
          return;
        }

        return {
          ...state,
          byId: {
            ...state.byId,
            [action.meta.galleryId]: {
              ...state.byId[action.meta.galleryId],
              pictures: [...state.byId[action.meta.galleryId].pictures, action.payload.result]
            }
          }
        };
      }

      case Gallery.DELETE_PICTURE.SUCCESS: {
        return {
          ...state,
          byId: {
            ...state.byId,
            [action.meta.galleryId]: {
              ...state.byId[action.meta.galleryId],
              pictures: state.byId[action.meta.galleryId].pictures.filter(
                picture => picture !== action.meta.pictureId
              )
            }
          }
        };
      }

      default: {
        return state;
      }
    }
  };
}

export default createEntityReducer({
  key: 'pictures',
  types: {
    fetch: Gallery.FETCH
  },
  mutate
});

export const selectPictureById = createSelector(
  state => state.pictures.byId,
  (state, props) => props.pictureId,
  (picturesById, pictureId) => picturesById[pictureId]
);

export const selectCommentsForPicture = createSelector(
  selectPictureById,
  state => state.comments.byId,
  (picture, commentsById) => {
    if (!picture) return [];
    return (picture.comments || []).map(commentId => commentsById[commentId]);
  }
);
