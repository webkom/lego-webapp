import { GalleryPicture, Gallery } from '~/redux/actionTypes';
import callAPI from '~/redux/actions/callAPI';
import { galleryPictureSchema } from '~/redux/schemas';
import { uploadFile } from './FileActions';
import type { EntityId } from '@reduxjs/toolkit';
import type { DropFile } from 'app/components/Upload/ImageUpload';
import type { ParsedQs } from 'qs';
import type { AppDispatch } from '~/redux/createStore';
import type { GalleryListPicture } from '~/redux/models/GalleryPicture';

export const fetchGalleryPictures = (
  galleryId: EntityId,
  {
    next = false,
    query,
  }: {
    next?: boolean;
    query?: ParsedQs;
  } = {},
) =>
  callAPI({
    types: GalleryPicture.FETCH,
    endpoint: `/galleries/${galleryId}/pictures/`,
    query,
    schema: [galleryPictureSchema],
    pagination: {
      fetchNext: next,
    },
    meta: {
      errorMessage: 'Henting av bilder feilet',
    },
    propagateError: true,
  });

export function fetchGalleryPicture(galleryId: EntityId, pictureId: EntityId) {
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

export function updatePicture(galleryPicture: Partial<GalleryListPicture>) {
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

export function deletePicture(galleryId: EntityId, pictureId: EntityId) {
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
  galleryId: EntityId;
  file: string;
  active: boolean;
}) {
  return callAPI<GalleryListPicture>({
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
      }),
    );
    if (!action || !action.meta) return;
    return dispatch(
      CreateGalleryPicture({
        galleryId,
        file: action.meta.fileToken,
        active: true,
      }),
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

  const uploadInBatches = async (fileBatch) => {
    const uploadPromises = fileBatch.map((file) =>
      uploadPictureWithErrorhandler(file),
    );
    return Promise.all(uploadPromises);
  };

  const uploadSequentially = async () => {
    for (let i = 0; i < files.length; i += MAX_UPLOADS) {
      const fileBatch = files.slice(i, i + MAX_UPLOADS);
      await uploadInBatches(fileBatch);
    }
  };

  return uploadSequentially();
}

export function uploadAndCreateGalleryPicture(
  galleryId: EntityId,
  files: File | DropFile[],
) {
  return async (dispatch: AppDispatch) => {
    dispatch({
      type: Gallery.UPLOAD.BEGIN,
      meta: {
        imageCount: files.length,
      },
    });
    await uploadGalleryPicturesInTurn(files, galleryId, dispatch);
    return dispatch({
      type: Gallery.UPLOAD.SUCCESS,
      meta: {
        imageCount: files.length,
      },
    });
  };
}
