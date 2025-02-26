import { describe, it, expect } from 'vitest';
import { GalleryPicture, Gallery } from '~/redux/actionTypes';
import galleryPictures, { hideUploadStatus } from '../galleryPictures';
import type { GalleryListPicture } from '~/redux/models/GalleryPicture';

describe('reducers', () => {
  const baseState: ReturnType<typeof galleryPictures> = {
    actionGrant: [],
    paginationNext: {},
    fetching: false,
    ids: [1],
    entities: {
      1: {} as GalleryListPicture,
    },
    uploadStatus: {
      imageCount: 0,
      showStatus: false,
      successCount: 0,
      failedImages: [],
      failCount: 0,
    },
  };
  describe('galleryPictures', () => {
    it('Gallery.UPLOAD.BEGIN', () => {
      const prevState = baseState;
      const action = {
        type: Gallery.UPLOAD.BEGIN,
        meta: {
          imageCount: 3,
        },
      };
      expect(galleryPictures(prevState, action)).toEqual({
        ...prevState,
        uploadStatus: {
          imageCount: 3,
          showStatus: true,
          successCount: 0,
          failedImages: [],
          failCount: 0,
        },
      });
    });
    it('Gallery.HIDE_UPLOAD_STATUS', () => {
      const prevState = baseState;
      const action = hideUploadStatus();
      expect(galleryPictures(prevState, action)).toEqual({
        ...prevState,
        uploadStatus: {
          imageCount: 0,
          showStatus: false,
          successCount: 0,
          failedImages: [],
          failCount: 0,
        },
      });
    });
    it('GalleryPicture.DELETE.SUCCESS', () => {
      const prevState = baseState;
      const action = {
        type: GalleryPicture.DELETE.SUCCESS,
        meta: {
          endpoint: '/galleries/1/pictures/1/',
          id: 1,
        },
      };
      expect(galleryPictures(prevState, action)).toEqual({
        ...prevState,
        ids: [],
        entities: {},
      });
    });
    it('GalleryPicture.CREATE.SUCCESS', () => {
      const prevState: ReturnType<typeof galleryPictures> = {
        ...baseState,
        ids: [],
        entities: {},
        uploadStatus: {
          imageCount: 3,
          showStatus: true,
          successCount: 0,
          failedImages: [],
          failCount: 0,
        },
      };
      const action = {
        type: GalleryPicture.CREATE.SUCCESS,
        payload: {
          result: {
            id: 5,
          },
        },
      };
      expect(galleryPictures(prevState, action)).toEqual({
        ...prevState,
        uploadStatus: {
          imageCount: 3,
          showStatus: true,
          successCount: 1,
          failedImages: [],
          failCount: 0,
          lastUploadedImage: {
            id: 5,
          },
        },
      });
    });
    it('GalleryPicture.UPLOAD.FAILURE', () => {
      const prevState: ReturnType<typeof galleryPictures> = {
        ...baseState,
        uploadStatus: {
          imageCount: 3,
          showStatus: true,
          successCount: 1,
          failedImages: [],
          failCount: 0,
          lastUploadedImage: 5,
        },
      };
      const action = {
        type: GalleryPicture.UPLOAD.FAILURE,
        payload: {
          result: {
            id: 6,
          },
        },
        meta: {
          fileName: 'troll.gif',
        },
      };
      expect(galleryPictures(prevState, action)).toEqual({
        ...prevState,
        uploadStatus: {
          imageCount: 3,
          showStatus: true,
          successCount: 1,
          failedImages: ['troll.gif'],
          failCount: 1,
          lastUploadedImage: 5,
        },
      });
    });
  });
});
