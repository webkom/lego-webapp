// @flow

import { createSelector } from 'reselect';
import { Gallery } from '../actions/ActionTypes';
import { mutatePictures } from 'app/reducers/pictures';
import createEntityReducer from 'app/utils/createEntityReducer';
import defaultAlbumCover from 'app/assets/default-album-cover.jpg';

export type GalleryEntity = {
  id: number,
  title: string,
  description: string,
  text: string,
  comments: Array<number>
};

export default createEntityReducer({
  key: 'galleries',
  types: {
    fetch: Gallery.FETCH
  },
  mutate: mutatePictures()
});

const transformGallery = gallery => {
  if (!gallery) {
    return {
      photographers: []
    };
  }

  return {
    ...gallery,
    cover: gallery.cover || {
      file: defaultAlbumCover,
      thumbnail: defaultAlbumCover
    }
  };
};

export const selectGalleries = createSelector(
  state => state.galleries.byId,
  state => state.galleries.items,
  (galleriesById, galleryIds) =>
    galleryIds.map(id => transformGallery(galleriesById[id]))
);

export const selectGalleryById = createSelector(
  state => state.galleries.byId,
  (state, props) => props.galleryId,
  (galleriesById, galleryId) => transformGallery(galleriesById[galleryId])
);

export const selectPicturesForGallery = createSelector(
  selectGalleryById,
  state => state.pictures.byId,
  (gallery, picturesById) => {
    if (!gallery) return [];

    return (gallery.pictures || []).map(pictureId => picturesById[pictureId]);
  }
);
