// @flow

import Promise from 'bluebird';
import { Gallery } from './ActionTypes';
import { gallerySchema, galleryPictureSchema } from 'app/reducers';
import { uploadFile } from './FileActions';
import callAPI from 'app/actions/callAPI';
import createQueryString from 'app/utils/createQueryString';
import type { EntityID, GalleryEntity, GalleryPictureEntity } from 'app/types';

export function fetchAll(
  { year, month }: { year: string, month: string } = {}
) {
  return callAPI({
    types: Gallery.FETCH,
    endpoint: `/galleries/${createQueryString({ year, month })}`,
    schema: [gallerySchema],
    meta: {
      errorMessage: 'Fetching galleries failed'
    }
  });
}

export function fetchGallery(galleryId: EntityID) {
  return callAPI({
    types: Gallery.FETCH,
    endpoint: `/galleries/${galleryId}/`,
    schema: gallerySchema,
    meta: {
      errorMessage: 'Fetching gallery failed'
    }
  });
}

export function createGallery({
  title,
  description,
  location,
  takenAt,
  photographers,
  event
}: GalleryEntity) {
  return callAPI({
    types: Gallery.CREATE,
    endpoint: '/galleries/',
    method: 'POST',
    schema: gallerySchema,
    body: {
      title,
      description,
      location,
      takenAt,
      photographers,
      event
    },
    meta: {
      errorMessage: 'Creating gallery failed'
    }
  });
}

export function editGallery({
  id,
  title,
  description,
  location,
  takenAt,
  photographers,
  event,
  cover
}: GalleryEntity) {
  return callAPI({
    types: Gallery.EDIT,
    endpoint: `/galleries/${id}/`,
    method: 'PUT',
    schema: gallerySchema,
    body: {
      title,
      description,
      location,
      takenAt,
      photographers,
      event,
      cover
    },
    meta: {
      errorMessage: 'Editing gallery failed'
    }
  });
}

export function updatePicture({
  galleryId,
  pictureId,
  description,
  active
}: GalleryPictureEntity) {
  return callAPI({
    types: Gallery.EDIT_PICTURE,
    endpoint: `/galleries/${galleryId}/pictures/${pictureId}/`,
    method: 'PUT',
    schema: galleryPictureSchema,
    body: {
      description,
      active
    },
    meta: {
      galleryId,
      errorMessage: 'Updating picture belonging gallery failed'
    }
  });
}

export function addPicture({
  galleryId,
  active,
  file,
  description
}: GalleryPictureEntity) {
  return callAPI({
    types: Gallery.ADD_PICTURE,
    endpoint: `/galleries/${galleryId}/pictures/`,
    method: 'POST',
    schema: galleryPictureSchema,
    body: {
      description,
      active,
      file
    },
    meta: {
      galleryId,
      errorMessage: 'Adding picture belonging gallery failed'
    }
  });
}

export function deletePicture({ galleryId, pictureId }: GalleryPictureEntity) {
  return callAPI({
    types: Gallery.DELETE_PICTURE,
    endpoint: `/galleries/${galleryId}/pictures/${pictureId}/`,
    method: 'DELETE',
    schema: galleryPictureSchema,
    meta: {
      galleryId,
      errorMessage: 'Deleting picture belonging gallery failed'
    }
  });
}

export function editPicture({ galleryId, pictureId }: GalleryPictureEntity) {
  return callAPI({
    types: Gallery.DELETE_PICTURE,
    endpoint: `/galleries/${galleryId}/pictures/${pictureId}/`,
    method: 'DELETE',
    schema: galleryPictureSchema,
    meta: {
      galleryId,
      errorMessage: 'Deleting picture belonging gallery failed'
    }
  });
}

export function addPictures(galleryId: number, files: []) {
  return dispatch =>
    Promise.map(files, file =>
      dispatch(uploadFile({ file })).then(action =>
        dispatch(
          addPicture({ galleryId, file: action.meta.fileToken, active: true })
        )
      )
    );
}
