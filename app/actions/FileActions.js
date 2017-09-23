// @flow

import { File as FileType } from './ActionTypes';
import callAPI from './callAPI';
import type { Thunk } from 'app/types';
import slug from 'slug';

/**
 * Normalize filenames
 * Remove non-word chars and replace spaces.
 */
const normalizeFilename: (filename: string) => string = filename => {
  const extensionIndex = filename.lastIndexOf('.');
  if (extensionIndex > 0) {
    const name = slug(filename.substr(0, extensionIndex), { symbols: true });
    const extension = filename.substr(extensionIndex);
    return `${name}${extension}`;
  }
  return slug(filename, { symbols: true });
};

export function fetchSignedPost(key: string, isPublic: boolean) {
  return callAPI({
    types: FileType.FETCH_SIGNED_POST,
    method: 'post',
    endpoint: '/files/',
    body: {
      key: normalizeFilename(key),
      public: isPublic
    }
  });
}

type UploadArgs = {
  file: File,
  fileName?: string,
  isPublic?: boolean
};

export function uploadFile({
  file,
  fileName,
  isPublic = false
}: UploadArgs): Thunk<*> {
  return dispatch =>
    dispatch(fetchSignedPost(fileName || file.name, isPublic)).then(action =>
      dispatch(
        callAPI({
          types: FileType.UPLOAD,
          method: 'post',
          endpoint: action.payload.url,
          body: action.payload.fields,
          files: [file],
          timeout: 0,
          json: false,
          headers: {
            Accept: 'application/json'
          },
          requiresAuthentication: false,
          meta: {
            fileKey: action.payload.file_key,
            fileToken: action.payload.file_token
          }
        })
      )
    );
}
