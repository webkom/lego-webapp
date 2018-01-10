// @flow

import { Gallery } from './ActionTypes';
import { gallerySchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import type { EntityID, GalleryEntity } from 'app/types';
import type { Thunk } from 'app/types';

export function fetch(
  galleryId: number,
  { next, filters }: { next: boolean, filters: Object } = {}
): Thunk<*> {
  return (dispatch, getState) => {
    const cursor = next ? getState().galleryPictures.pagination.next : {};

    return dispatch(
      callAPI({
        types: Gallery.FETCH,
        endpoint: `/galleries/`,
        useCache: false,
        query: {
          ...cursor,
          ...filters
        },
        schema: [gallerySchema],
        meta: {
          errorMessage: 'Henting av epostlister feilet'
        },
        propagateError: true
      })
    );
  };
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

export function createGallery(gallery: GalleryEntity) {
  return callAPI({
    types: Gallery.CREATE,
    endpoint: '/galleries/',
    method: 'POST',
    schema: gallerySchema,
    body: gallery,
    meta: {
      errorMessage: 'Opprettelse av galleri feilet'
    }
  });
}

export function updateGallery(gallery: GalleryEntity) {
  return callAPI({
    types: Gallery.EDIT,
    endpoint: `/galleries/${gallery.id}/`,
    method: 'PUT',
    schema: gallerySchema,
    body: gallery,
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
