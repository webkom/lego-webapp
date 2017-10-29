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

export function fetchGalleryPicture(galleryId: EntityID, pictureId: EntityID) {
  return callAPI({
    types: GalleryPicture.FETCH,
    endpoint: `/galleries/${galleryId}/pictures/${pictureId}`,
    schema: galleryPictureSchema,
    meta: {
      errorMessage: 'Henting av galleri feilet'
    }
  });
}

export function updatePicture(galleryPicture: GalleryPictureEntity) {
  return callAPI({
    types: GalleryPicture.EDIT,
    endpoint: `/galleries/${galleryPicture.galleryId}/pictures/${galleryPicture.id}/`,
    method: 'PATCH',
    schema: galleryPictureSchema,
    body: galleryPicture,
    meta: {
      galleryId: galleryPicture.galleryId,
      id: galleryPicture.id,
      errorMessage: 'Oppdatering av bilde i galleriet feilet'
    }
  });
}

export function deletePicture(galleryId: EntityID, pictureId: EntityID) {
  return callAPI({
    types: GalleryPicture.EDIT,
    endpoint: `/galleries/${galleryId}/pictures/${pictureId}/`,
    method: 'DELETE',
    schema: galleryPictureSchema,
    meta: {
      galleryId: galleryId,
      id: pictureId,
      errorMessage: 'Oppdatering av bilde i galleriet feilet'
    }
  });
}

export function CreateGalleryPicture(galleryPicture: GalleryPictureEntity) {
  return callAPI({
    types: GalleryPicture.CREATE,
    endpoint: `/galleries/${galleryPicture.galleryId}/pictures/`,
    method: 'POST',
    schema: galleryPictureSchema,
    body: galleryPicture,
    meta: {
      galleryId: galleryPicture.galleryId,
      errorMessage: 'Legg til bilde i galleriet feilet'
    }
  });
}

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
