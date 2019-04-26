import { createSelector } from 'reselect';
import { Gallery, GalleryPicture } from 'app/actions/ActionTypes';
import { mutateComments } from 'app/reducers/comments';
import joinReducers from 'app/utils/joinReducers';
import createEntityReducer from 'app/utils/createEntityReducer';
import { UploadStatus } from 'app/types/utils';

export const initialUploadStatus: UploadStatus = {
  imageCount: 0,
  successCount: 0,
  failedImages: [],
  failCount: 0,
  showStatus: false
};

function mutateGalleryPicture(state: any, action: any) {
  const { uploadStatus = initialUploadStatus } = state;
  switch (action.type) {
    case GalleryPicture.DELETE.SUCCESS: {
      return {
        ...state,
        items: state.items.filter(id => id !== action.meta.id)
      };
    }
    case Gallery.UPLOAD.BEGIN: {
      const imageCount = uploadStatus.imageCount + action.meta.imageCount;
      return {
        ...state,
        uploadStatus: {
          ...uploadStatus,
          imageCount,
          showStatus: true
        }
      };
    }
    case Gallery.HIDE_UPLOAD_STATUS: {
      return {
        ...state,
        uploadStatus: {
          ...uploadStatus,
          showStatus: false
        }
      };
    }
    case GalleryPicture.CREATE.SUCCESS: {
      const successCount = uploadStatus.successCount + 1;

      // Only update thumbnail in upload status for each 10th picture
      const lastUploadedImage =
        !uploadStatus.lastUploadedImage || successCount % 10 == 0
          ? action.payload.result
          : uploadStatus.lastUploadedImage;
      return {
        ...state,
        uploadStatus: {
          ...uploadStatus,
          successCount,
          showStatus: true,
          lastUploadedImage
        }
      };
    }
    case GalleryPicture.UPLOAD.FAILURE: {
      const failCount = uploadStatus.failCount + 1;
      const failedImages = [...uploadStatus.failedImages, action.meta.fileName];
      return {
        ...state,
        uploadStatus: {
          ...uploadStatus,
          failCount,
          showStatus: true,
          failedImages
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
