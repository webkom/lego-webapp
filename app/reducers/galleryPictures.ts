import { createSelector } from 'reselect';
import { Gallery, GalleryPicture } from 'app/actions/ActionTypes';
import type { ID } from 'app/models';
import { mutateComments, selectCommentEntities } from 'app/reducers/comments';
import createEntityReducer from 'app/utils/createEntityReducer';
import joinReducers from 'app/utils/joinReducers';

export type UploadStatus = {
  imageCount: number;
  successCount: number;
  failCount: number;
  failedImages: Array<string>;
  lastUploadedImage?: ID;
  showStatus: boolean;
};
export const initialUploadStatus: UploadStatus = {
  imageCount: 0,
  successCount: 0,
  failedImages: [],
  failCount: 0,
  showStatus: false,
};
export type GalleryPictureEntity = {
  id: number;
  title: string;
  gallery: number;
  description: string;
  text: string;
  active: boolean;
  comments: Array<number>;
  file: string;
  thumbnail: string;
  rawFile: string;
};

function mutateGalleryPicture(state: any, action: any) {
  const { uploadStatus = initialUploadStatus } = state;

  switch (action.type) {
    case Gallery.UPLOAD.BEGIN: {
      const imageCount = uploadStatus.imageCount + action.meta.imageCount;
      return {
        ...state,
        uploadStatus: { ...uploadStatus, imageCount, showStatus: true },
      };
    }

    case Gallery.HIDE_UPLOAD_STATUS: {
      return { ...state, uploadStatus: { ...uploadStatus, showStatus: false } };
    }

    case GalleryPicture.CREATE.SUCCESS: {
      const successCount = uploadStatus.successCount + 1;
      // Only update thumbnail in upload status for each 10th picture
      const lastUploadedImage =
        !uploadStatus.lastUploadedImage || successCount % 10 === 0
          ? action.payload.result
          : uploadStatus.lastUploadedImage;
      return {
        ...state,
        uploadStatus: {
          ...uploadStatus,
          successCount,
          showStatus: true,
          lastUploadedImage,
        },
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
          failedImages,
        },
      };
    }

    case GalleryPicture.CLEAR: {
      const newById = Object.fromEntries(
        // Not using Object.entries() since flow will complain...
        Object.keys(state.byId)
          .map((key) => [key, state.byId[key]])
          .filter(([_, v]) => {
            return v.gallery !== action.meta.id;
          })
      );
      const newItems = Object.keys(newById).map((id) => parseInt(id));
      return {
        ...state,
        byId: newById,
        items: newItems,
        pagination: {},
        paginationNext: {},
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
    fetch: GalleryPicture.FETCH,
    delete: GalleryPicture.DELETE,
  },
  mutate,
});
export const SelectGalleryPicturesByGalleryId = createSelector(
  (state) => state.galleryPictures.byId,
  (state) => state.galleryPictures.items,
  (state, props) => props.galleryId,
  (galleryPicturesById, galleryPictureIds, galleryId) =>
    galleryPictureIds
      .map((id) => galleryPicturesById[id])
      .filter(
        (galleryPicture) => galleryPicture.gallery === parseInt(galleryId)
      )
);
export const selectGalleryPictureById = createSelector(
  (state) => state.galleryPictures.byId,
  (state, props) => props.pictureId,
  (picturesById, pictureId) => picturesById[pictureId]
);
export const selectCommentsForGalleryPicture = createSelector(
  selectGalleryPictureById,
  selectCommentEntities,
  (picture, commentEntities) => {
    if (!picture) return [];
    return (picture.comments || []).map(
      (commentId) => commentEntities[commentId]
    );
  }
);
