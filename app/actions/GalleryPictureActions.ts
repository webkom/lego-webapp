import PromisePool from 'es6-promise-pool';
import callAPI from 'app/actions/callAPI';
import { galleryPictureSchema } from 'app/reducers';
import { GalleryPicture, Gallery } from './ActionTypes';
import { uploadFile } from './FileActions';
import type { GalleryPictureEntity } from 'app/reducers/galleryPictures';
import type { AppDispatch } from 'app/store/createStore';
import type { ID } from 'app/store/models';
import type { Thunk } from 'app/types';

export function fetch(
  galleryId: number,
  {
    next,
    filters,
  }: {
    next?: boolean;
    filters?: Record<string, string | number>;
  } = {}
): Thunk<any> {
  return (dispatch, getState) => {
    const cursor = next ? getState().galleryPictures.pagination.next : {};
    return dispatch(
      callAPI({
        types: GalleryPicture.FETCH,
        endpoint: `/galleries/${galleryId}/pictures/`,
        query: { ...cursor, ...filters },
        schema: [galleryPictureSchema],
        meta: {
          errorMessage: 'Henting av bilder feilet',
        },
        propagateError: true,
      })
    );
  };
}

export function fetchSiblingGallerPicture(
  galleryId: ID,
  currentPictureId: ID,
  next: boolean
) {
  const rawCursor = `p=${currentPictureId}&r=${next ? 0 : 1}`;
  const cursor = Buffer.from(rawCursor).toString('base64');
  return callAPI({
    types: GalleryPicture.FETCH_SIBLING,
    endpoint: `/galleries/${galleryId}/pictures/`,
    query: {
      page_size: 1,
      cursor,
    },
    schema: [galleryPictureSchema],
    meta: {
      errorMessage: 'Henting av bilde feilet',
    },
    propagateError: true,
  });
}

export function fetchGalleryPicture(galleryId: ID, pictureId: ID) {
  return callAPI({
    types: GalleryPicture.FETCH,
    endpoint: `/galleries/${galleryId}/pictures/${pictureId}/`,
    schema: galleryPictureSchema,
    meta: {
      errorMessage: 'Henting av galleri feilet',
    },
    propagateError: true,
  });
}

export function updatePicture(
  galleryPicture: GalleryPictureEntity
): Thunk<any> {
  return callAPI({
    types: GalleryPicture.EDIT,
    endpoint: `/galleries/${galleryPicture.gallery}/pictures/${galleryPicture.id}/`,
    method: 'PATCH',
    schema: galleryPictureSchema,
    body: galleryPicture,
    meta: {
      galleryId: galleryPicture.gallery,
      id: galleryPicture.id,
      errorMessage: 'Oppdatering av bilde i galleriet feilet',
    },
  });
}

export function deletePicture(galleryId: ID, pictureId: ID) {
  return callAPI({
    types: GalleryPicture.DELETE,
    endpoint: `/galleries/${galleryId}/pictures/${pictureId}/`,
    method: 'DELETE',
    schema: galleryPictureSchema,
    meta: {
      galleryId: galleryId,
      id: pictureId,
      errorMessage: 'Sletting av bilde i galleriet feilet',
      successMessage: 'Bildet ble slettet!',
    },
  });
}

export function CreateGalleryPicture(galleryPicture: {
  galleryId: ID;
  file: string;
  active: boolean;
}): Thunk<any> {
  return callAPI({
    types: GalleryPicture.CREATE,
    endpoint: `/galleries/${galleryPicture.galleryId}/pictures/`,
    method: 'POST',
    schema: galleryPictureSchema,
    body: galleryPicture,
    meta: {
      galleryId: galleryPicture.galleryId,
      errorMessage: 'Opplasting av bilde i galleriet feilet',
    },
  });
}

const MAX_UPLOADS = 3;

function uploadGalleryPicturesInTurn(files, galleryId, dispatch) {
  const uploadPicture = async (file) => {
    const action = await dispatch(
      uploadFile({
        file,
        timeout: 3 * 60 * 1000,
      })
    );
    if (!action || !action.meta) return;
    return dispatch(
      CreateGalleryPicture({
        galleryId,
        file: action.meta.fileToken,
        active: true,
      })
    );
  };

  const uploadPictureWithErrorhandler = (file) =>
    uploadPicture(file).catch(() => {
      dispatch({
        type: GalleryPicture.UPLOAD.FAILURE,
        error: true,
        meta: {
          fileName: file.name,
          errorMessage: 'Opplasting av bilde feilet',
        },
      });
    });

  const promiseProducer = function* () {
    for (const file of files) {
      yield uploadPictureWithErrorhandler(file);
    }
  };

  const _data = promiseProducer();

  return new PromisePool(() => _data.next().value, MAX_UPLOADS).start();
}

export function uploadAndCreateGalleryPicture(
  galleryId: ID,
  files: Array<Record<string, any>>
): Thunk<any> {
  return (dispatch) => {
    dispatch({
      type: Gallery.UPLOAD.BEGIN,
      meta: {
        imageCount: files.length,
      },
    });
    return uploadGalleryPicturesInTurn(files, galleryId, dispatch);
  };
}

export function clear(galleryId: ID) {
  return (dispatch: AppDispatch) =>
    dispatch({
      type: GalleryPicture.CLEAR,
      meta: {
        id: galleryId,
      },
    });
}
