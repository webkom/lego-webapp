// @flow

import { Gallery } from './ActionTypes';
import { gallerySchema, galleryPictureSchema } from 'app/reducers';
import { uploadFile } from './FileActions';
import callAPI from 'app/actions/callAPI';
import createQueryString from 'app/utils/createQueryString';
import type { EntityID, GalleryEntity, GalleryPictureEntity } from 'app/types';
import type { Thunk } from 'app/types';

export function fetchAll(
  { year, month }: { year: string, month: string } = {}
) {
  return callAPI({
    types: Gallery.FETCH,
    endpoint: `/galleries/${createQueryString({ year, month })}`,
    schema: [gallerySchema],
    meta: {
      errorMessage: 'Henting av gallerier feilet'
    }
  });
}

export function fetchGallery(galleryId: EntityID) {
  return callAPI({
    types: Gallery.FETCH,
    endpoint: `/galleries/${galleryId}/`,
    schema: gallerySchema,
    meta: {
      errorMessage: 'Henting av galleri feilet'
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
      event,
      takenAt,
      photographers: photographers || []
    },
    meta: {
      errorMessage: 'Opprettelse av galleri feilet'
    }
  });
}

export function updateGallery(
  id: EntityID,
  { title, description, location, takenAt, photographers, event }: GalleryEntity
) {
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
      event
    },
    meta: {
      errorMessage: 'Endring av galleri feilet'
    }
  });
}

export function updateGalleryCover(id: EntityID, cover: EntityID) {
  return callAPI({
    types: Gallery.EDIT,
    endpoint: `/galleries/${id}/`,
    method: 'PATCH',
    schema: gallerySchema,
    body: {
      cover
    },
    meta: {
      errorMessage: 'Endring av galleri cover feilet'
    }
  });
}

export function updatePicture(
  galleryId: EntityID,
  pictureId: EntityID,
  { description, active, taggees }: GalleryPictureEntity
) {
  return callAPI({
    types: Gallery.EDIT_PICTURE,
    endpoint: `/galleries/${galleryId}/pictures/${pictureId}/`,
    method: 'PATCH',
    schema: galleryPictureSchema,
    body: {
      description,
      active,
      taggees
    },
    meta: {
      galleryId,
      pictureId,
      errorMessage: 'Oppdatering av bilde i galleriet feilet'
    }
  });
}

export function deleteGallery(galleryId: EntityID) {
  return callAPI({
    types: Gallery.DELETE,
    endpoint: `/galleries/${galleryId}/`,
    method: 'DELETE',
    schema: gallerySchema,
    meta: {
      galleryId,
      errorMessage: 'Sletting av galleri feilet'
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
      errorMessage: 'Legg til bilde i galleriet feilet'
    }
  });
}

export function deletePicture(galleryId: EntityID, pictureId: EntityID) {
  return callAPI({
    types: Gallery.DELETE_PICTURE,
    endpoint: `/galleries/${galleryId}/pictures/${pictureId}/`,
    method: 'DELETE',
    schema: galleryPictureSchema,
    meta: {
      galleryId,
      pictureId,
      errorMessage: 'Sletting av bilde i galleriet feilet'
    }
  });
}

export function editPicture(galleryId: EntityID, pictureId: EntityID) {
  return callAPI({
    types: Gallery.DELETE_PICTURE,
    endpoint: `/galleries/${galleryId}/pictures/${pictureId}/`,
    method: 'DELETE',
    schema: galleryPictureSchema,
    meta: {
      galleryId,
      errorMessage: 'Endring av bilde i galleriet feilet'
    }
  });
}

// returns Thunk<any> because callAPI don't really support arrays
export function addPictures(galleryId: number, files: []): Thunk<any> {
  return dispatch =>
    Promise.all(
      files.map(file =>
        dispatch(uploadFile({ file })).then(action => {
          if (!action || !action.meta) return;
          return dispatch(
            addPicture({ galleryId, file: action.meta.fileToken, active: true })
          );
        })
      )
    );
}
