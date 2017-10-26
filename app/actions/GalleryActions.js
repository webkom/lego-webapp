// @flow

import { Gallery } from './ActionTypes';
import { gallerySchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import createQueryString from 'app/utils/createQueryString';
import type { EntityID, GalleryEntity } from 'app/types';
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
