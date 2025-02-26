import { Gallery } from '~/redux/actionTypes';
import callAPI from '~/redux/actions/callAPI';
import { gallerySchema } from '~/redux/schemas';
import type { EntityId } from '@reduxjs/toolkit';
import type { FormValues as GalleryEditorFormValues } from 'app/routes/photos/components/GalleryEditor';
import type { ParsedQs } from 'qs';
import type { DetailedGallery } from '~/redux/models/Gallery';

export const fetchGalleries = ({
  next = false,
  query,
}: {
  next?: boolean;
  query?: ParsedQs;
} = {}) =>
  callAPI({
    types: Gallery.FETCH,
    endpoint: `/galleries/`,
    query,
    pagination: {
      fetchNext: next,
    },
    schema: [gallerySchema],
    meta: {
      errorMessage: 'Henting av bilder feilet',
    },
    propagateError: false,
  });

export function fetchGallery(galleryId: EntityId) {
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

export function fetchGalleryMetadata(galleryId: EntityId) {
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

export function updateGallery(
  galleryId: EntityId,
  gallery: GalleryEditorFormValues,
) {
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

export function updateGalleryCover(id: EntityId, cover: EntityId) {
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

export function deleteGallery(id: EntityId) {
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
