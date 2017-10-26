// @flow

import { GalleryPicture, Gallery } from './ActionTypes';
import { galleryPictureSchema } from 'app/reducers';
import { uploadFile } from './FileActions';
import { type GalleryPictureEntity } from 'app/reducers/galleryPictures';
import callAPI from 'app/actions/callAPI';
import type { EntityID } from 'app/types';
import type { Thunk } from 'app/types';

export function fetch(
  galleryId: number,
  { next, filters }: { next: boolean, filters: Object } = {}
): Thunk<*> {
  return (dispatch, getState) => {
    const cursor = next ? getState().galleryPictures.pagination.next : {};

    return dispatch(
      callAPI({
        types: GalleryPicture.FETCH,
        endpoint: `/galleries/${galleryId}/pictures/`,
        useCache: false,
        query: {
          ...cursor,
          ...filters
        },
        schema: [galleryPictureSchema],
        meta: {
          errorMessage: 'Henting av epostlister feilet'
        },
        propagateError: true
      })
    );
  };
}

export function fetchGalleryPicture(galleryId: EntityID) {
  return callAPI({
    types: GalleryPicture.FETCH,
    endpoint: `/galleries/${galleryId}/`,
    schema: galleryPictureSchema,
    meta: {
      errorMessage: 'Henting av galleri feilet'
    }
  });
}

export function updatePicture(
  galleryId: EntityID,
  pictureId: EntityID,
  { description, active, taggees }: GalleryPictureEntity
) {
  return callAPI({
    types: GalleryPicture.EDIT_PICTURE,
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

export function CreateGalleryPicture({
  galleryId,
  active,
  file,
  description
}: GalleryPictureEntity) {
  return callAPI({
    types: GalleryPicture.CREATE,
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

export function editPicture(galleryId: EntityID, pictureId: EntityID) {
  return callAPI({
    types: GalleryPicture.EDIT,
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
export function uploadAndCreateGalleryPicture(
  galleryId: number,
  files: Array<Object>
): Thunk<any> {
  return dispatch => {
    dispatch({ type: Gallery.UPLOAD.BEGIN });
    return Promise.all(
      files.map(file =>
        dispatch(uploadFile({ file })).then(action => {
          if (!action || !action.meta) return;
          return dispatch(
            CreateGalleryPicture({
              galleryId,
              file: action.meta.fileToken,
              active: true
            })
          );
        })
      )
    )
      .then(() => {
        dispatch({ type: Gallery.UPLOAD.SUCCESS });
      })
      .catch(() => {
        dispatch({ type: Gallery.UPLOAD.FAILURE });
      });
  };
}
