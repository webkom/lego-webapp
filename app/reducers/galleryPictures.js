// @flow

import { createSelector } from 'reselect';
import { Gallery, GalleryPicture } from 'app/actions/ActionTypes';
import { mutateComments } from 'app/reducers/comments';
import joinReducers from 'app/utils/joinReducers';
import createEntityReducer from 'app/utils/createEntityReducer';
import { type ID } from 'app/models';

export type UploadStatus = {
  imageCount: number,
  successCount: number,
  failCount: number,
  failedImages: Array<string>,
  lastUploadedImage?: ID,
  lastGallery?: ID
};

const initialUploadStatus: UploadStatus = {
  imageCount: 0,
  successCount: 0,
  failedImages: [],
  failCount: 0
};

export type GalleryPictureEntity = {
  id: number,
  title: string,
  gallery: number,
  description: string,
  text: string,
  active: boolean,
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
    case Gallery.UPLOAD.BEGIN: {
      const { uploadStatus = initialUploadStatus } = state;
      const imageCount = uploadStatus.imageCount + action.meta.imageCount;
      return {
        ...state,
        uploadStatus: {
          ...uploadStatus,
          imageCount
        }
      };
    }
    case GalleryPicture.CREATE.SUCCESS: {
      const { uploadStatus = initialUploadStatus } = state;
      const successCount = uploadStatus.successCount + 1;
      return {
        ...state,
        uploadStatus: {
          ...uploadStatus,
          successCount,
          lastUploadedImage: action.payload.result,
          lastGallery: action.meta.galleryId
        }
      };
    }
    case GalleryPicture.UPLOAD.FAILURE: {
      const { uploadStatus = initialUploadStatus } = state;
      const failCount = uploadStatus.failCount + 1;
      return {
        ...state,
        uploadStatus: {
          ...uploadStatus,
          failCount,
          failedImages: [...uploadStatus.failedImages, action.meta.fileName]
        }
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
