import slug from 'slugify';
import { File as FileType, ImageGallery } from '~/redux/actionTypes';
import { imageGallerySchema } from '~/redux/schemas';
import callAPI from './callAPI';
import type { AppDispatch } from '~/redux/createStore';
import type { SignedPost } from '~/redux/models/File';

const slugifyFilename: (filename: string) => string = (filename) => {
  // Slug options
  const slugOpts = {
    replacement: '-',
    // replace all spaces with -
    remove: /[^a-zA-Z0-9/-\w.]+/g, // remove all letters that does not match this regex
  };
  const extensionIndex = filename.lastIndexOf('.');

  // If file has extension we slug the first part
  if (extensionIndex > 0) {
    const name = slug(filename.substr(0, extensionIndex), slugOpts);
    const extension = filename.substr(extensionIndex);
    return `${name}${extension}`;
  }

  // If the file has no extension we slug the whole filename
  return slug(filename, slugOpts);
};

export function fetchSignedPost(key: string, isPublic: boolean) {
  return callAPI<SignedPost>({
    types: FileType.FETCH_SIGNED_POST,
    method: 'POST',
    endpoint: '/files/',
    body: {
      key: slugifyFilename(key),
      public: isPublic,
    },
    meta: {
      errorMessage: 'Filopplasting feilet',
    },
  });
}
export type UploadArgs = {
  file: Blob | File;
  fileName?: string;
  isPublic?: boolean;
  // Use big timeouts for big files. See app/utils/fetchJSON.js for more info
  // In ms. aka. 2sec = 2 * 1000;
  timeout?: number;
};
export function uploadFile({
  file,
  fileName,
  isPublic = false,
  timeout,
}: UploadArgs) {
  return (dispatch: AppDispatch) =>
    dispatch(
      fetchSignedPost(fileName || ('name' in file ? file.name : ''), isPublic),
    ).then((action) => {
      const meta = {
        fileKey: action.payload.file_key,
        fileToken: action.payload.file_token,
        errorMessage: 'Filopplasting feilet',
      };
      return dispatch(
        callAPI<void, typeof meta>({
          types: FileType.UPLOAD,
          method: 'POST',
          endpoint: action.payload.url,
          body: action.payload.fields,
          files: [file],
          timeout,
          json: false,
          headers: {
            Accept: 'application/json',
          },
          requiresAuthentication: false,
          meta,
        }),
      );
    });
}
export function fetchImageGallery({
  query,
}: {
  query?: Record<string, string>;
} = {}) {
  return callAPI({
    types: ImageGallery.FETCH_ALL,
    endpoint: '/events/cover_image_gallery/',
    schema: [imageGallerySchema],
    query,
    method: 'GET',
    meta: {
      errorMessage: 'Henting av bilder feilet',
    },
    propagateError: true,
  });
}

export function setSaveForUse(key: string, token: string, saveForUse: boolean) {
  return callAPI({
    types: FileType.PATCH,
    endpoint: `/files/${key}/imagegallery/`,
    method: 'PATCH',
    body: { token: token, save_for_use: saveForUse },
    meta: {
      errorMessage: 'Endring av hendelse feilet',
      id: key,
    },
  });
}
