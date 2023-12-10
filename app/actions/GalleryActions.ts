import callAPI from 'app/actions/callAPI';
import { gallerySchema } from 'app/reducers';
import { Gallery } from './ActionTypes';
import { FormValues as GalleryEditorFormValues } from 'app/routes/photos/components/GalleryEditor';
import type { Thunk } from 'app/types';
import type { ID } from 'app/store/models';
import type { DetailedGallery } from 'app/store/models/Gallery';

export function fetch({
  next,
  filters,
}: {
  next?: boolean;
  filters?: Record<string, string | number>;
} = {}): Thunk<any> {
  return (dispatch, getState) => {
    const cursor = next ? getState().galleries.pagination.next : {};
    return dispatch(
      callAPI({
        types: Gallery.FETCH,
        endpoint: `/galleries/`,
        query: { ...cursor, ...filters },
        schema: [gallerySchema],
        meta: {
          errorMessage: 'Henting av bilder feilet',
        },
        propagateError: false,
      })
    );
  };
}

export function fetchGallery(galleryId: ID) {
  return callAPI<DetailedGallery>({
    types: Gallery.FETCH,
    endpoint: `/galleries/${galleryId}/`,
    schema: gallerySchema,
    meta: {
      errorMessage: 'Henting av galleri feilet',
    },
    propagateError: false,
  });
}

export function fetchGalleryMetadata(galleryId: ID) {
  return callAPI({
    types: Gallery.FETCH,
    endpoint: `/galleries/${galleryId}/metadata/`,
    schema: gallerySchema,
    meta: {},
    propagateError: true,
  });
}

export function createGallery(gallery: GalleryEditorFormValues) {
  return callAPI<DetailedGallery>({
    types: Gallery.CREATE,
    endpoint: '/galleries/',
    method: 'POST',
    schema: gallerySchema,
    body: gallery,
    meta: {
      errorMessage: 'Opprettelse av galleri feilet',
    },
  });
}

export function updateGallery(galleryId: ID, gallery: GalleryEditorFormValues) {
  return callAPI<DetailedGallery>({
    types: Gallery.EDIT,
    endpoint: `/galleries/${galleryId}/`,
    method: 'PUT',
    schema: gallerySchema,
    body: gallery,
    meta: {
      errorMessage: 'Endring av galleri feilet',
    },
  });
}

export function updateGalleryCover(id: ID, cover: ID) {
  return callAPI({
    types: Gallery.EDIT,
    endpoint: `/galleries/${id}/`,
    method: 'PATCH',
    schema: gallerySchema,
    body: {
      cover,
    },
    meta: {
      errorMessage: 'Endring av galleri cover feilet',
    },
  });
}

export function deleteGallery(id: ID) {
  return callAPI({
    types: Gallery.DELETE,
    endpoint: `/galleries/${id}/`,
    method: 'DELETE',
    schema: gallerySchema,
    meta: {
      id,
      errorMessage: 'Sletting av galleri feilet',
    },
  });
}
