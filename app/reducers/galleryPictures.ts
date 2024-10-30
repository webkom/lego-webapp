import { createSlice } from '@reduxjs/toolkit';
import { Gallery, GalleryPicture } from 'app/actions/ActionTypes';
import { addCommentCases } from 'app/reducers/comments';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import type { EntityId, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from 'app/store/createRootReducer';
import type { AnyAction } from 'redux';

export type UploadStatus = {
  imageCount: number;
  successCount: number;
  failCount: number;
  failedImages: Array<string>;
  lastUploadedImage?: EntityId;
  showStatus: boolean;
};
export const initialUploadStatus: UploadStatus = {
  imageCount: 0,
  successCount: 0,
  failedImages: [],
  failCount: 0,
  showStatus: false,
};

const legoAdapter = createLegoAdapter(EntityType.GalleryPictures, {
  sortComparer: (a, b) => {
    return Number(a.id) - Number(b.id);
  },
});

const galleryPicturesSlice = createSlice({
  name: EntityType.GalleryPictures,
  initialState: legoAdapter.getInitialState({
    uploadStatus: initialUploadStatus,
  }),
  reducers: {
    hideUploadStatus: (state) => {
      state.uploadStatus.showStatus = false;
    },
    clearGallery: (state, action: PayloadAction<EntityId>) => {
      const idsToRemove = state.ids.filter(
        (id) => state.entities[id].gallery === action.payload,
      );
      legoAdapter.removeMany(state, idsToRemove);
    },
  },
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [GalleryPicture.FETCH],
    deleteActions: [GalleryPicture.DELETE],
    extraCases: (addCase) => {
      addCommentCases(EntityType.GalleryPictures, addCase);

      addCase(Gallery.UPLOAD.BEGIN, (state, action: AnyAction) => {
        state.uploadStatus.imageCount += action.meta.imageCount;
        state.uploadStatus.showStatus = true;
      });
      addCase(GalleryPicture.UPLOAD.FAILURE, (state, action: AnyAction) => {
        state.uploadStatus.showStatus = true;
        state.uploadStatus.failCount += 1;
        state.uploadStatus.failedImages.push(action.meta.fileName);
      });

      addCase(GalleryPicture.CREATE.SUCCESS, (state, action: AnyAction) => {
        state.uploadStatus.successCount += 1;
        state.uploadStatus.showStatus = true;
        if (
          !state.uploadStatus.lastUploadedImage ||
          state.uploadStatus.successCount % 10 === 0
        )
          state.uploadStatus.lastUploadedImage = action.payload.result;
      });
    },
  }),
});

export default galleryPicturesSlice.reducer;
export const { hideUploadStatus, clearGallery } = galleryPicturesSlice.actions;
export const {
  selectAll: selectAllGalleryPictures,
  selectById: selectGalleryPictureById,
  selectByField: selectGalleryPicturesByField,
} = legoAdapter.getSelectors((state: RootState) => state.galleryPictures);

export const selectGalleryPicturesByGalleryId = selectGalleryPicturesByField(
  'gallery',
  (a: EntityId, b: EntityId) => Number(a) === Number(b),
);
