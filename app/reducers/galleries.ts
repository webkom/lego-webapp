import { createSelector } from 'reselect';
import defaultAlbumCover from 'app/assets/default-album-cover.jpg';
import createEntityReducer from 'app/utils/createEntityReducer';
import { Gallery } from '../actions/ActionTypes';

export type GalleryEntity = {
  id: number;
  title: string;
  description: string;
  text?: string;
  comments?: Array<number>;
  cover?: Record<string, any>;
};

function mutate(state: any, action: any) {
  switch (action.type) {
    case Gallery.UPLOAD.BEGIN: {
      return { ...state, fetching: true };
    }

    case Gallery.UPLOAD.FAILURE: {
      return { ...state, fetching: false };
    }

    case Gallery.UPLOAD.SUCCESS: {
      return { ...state, fetching: false };
    }

    default:
      return state;
  }
}

export default createEntityReducer({
  key: 'galleries',
  mutate,
  types: {
    fetch: Gallery.FETCH,
  },
});

const transformGallery = (gallery) => {
  if (!gallery) {
    return {
      photographers: [],
    };
  }

  return {
    ...gallery,
    cover: gallery.cover || {
      file: defaultAlbumCover,
      thumbnail: defaultAlbumCover,
    },
  };
};

export const selectGalleries = createSelector(
  (state) => state.galleries.byId,
  (state) => state.galleries.items,
  (galleriesById, galleryIds) =>
    galleryIds.map((id) => transformGallery(galleriesById[id])),
);
export const selectGalleryById = createSelector(
  (state) => state.galleries.byId,
  (state, props) => props.galleryId,
  (galleriesById, galleryId) => transformGallery(galleriesById[galleryId]),
);
export const selectPicturesForGallery = createSelector(
  selectGalleryById,
  (state) => state.pictures.byId,
  (gallery, picturesById) => {
    if (!gallery) return [];
    // $FlowFixMe
    return (gallery.pictures || []).map((pictureId) => picturesById[pictureId]);
  },
);
