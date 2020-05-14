import galleryPictures from '../galleryPictures';
import { GalleryPicture, Gallery } from '../../actions/ActionTypes';

describe('reducers', () => {
  const baseState = {
    actionGrant: [],
    pagination: {},
    items: [1],
    byId: {
      1: {},
    },
  };

  describe('galleryPictures', () => {
    it('Gallery.UPLOAD.BEGIN', () => {
      const prevState = baseState;
      const action = {
        type: Gallery.UPLOAD.BEGIN,
        meta: { imageCount: 3 },
      };
      expect(galleryPictures(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        items: [1],
        byId: { 1: {} },
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
      const action = {
        type: Gallery.HIDE_UPLOAD_STATUS,
      };
      expect(galleryPictures(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        items: [1],
        byId: { 1: {} },
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
        meta: { id: 1 },
      };
      expect(galleryPictures(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        items: [],
        byId: {},
      });
    });
    it('GalleryPicture.CREATE.SUCCESS', () => {
      const prevState = {
        actionGrant: [],
        pagination: {},
        items: [],
        byId: {},
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
        actionGrant: [],
        pagination: {},
        items: [],
        byId: {},
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
      const prevState = {
        actionGrant: [],
        pagination: {},
        items: [],
        byId: {},
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
        actionGrant: [],
        pagination: {},
        items: [],
        byId: {},
        uploadStatus: {
          imageCount: 3,
          showStatus: true,
          successCount: 1,
          failedImages: ['troll.gif'],
          failCount: 1,
          lastUploadedImage: {
            id: 5,
          },
        },
      });
    });
  });
});
