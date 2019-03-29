// @flow

import { File as FileType } from './ActionTypes';
import callAPI from './callAPI';
import type { Thunk } from 'app/types';
import slug from 'slugify';

const slugOpts = { remove: /[#*+~.()'"!:@]/g };
/**
 * Normalize filenames
 * Remove non-word chars and replace spaces.
 */
const normalizeFilename: (filename: string) => string = filename => {
  const extensionIndex = filename.lastIndexOf('.');
  if (extensionIndex > 0) {
    const name = slug(filename.substr(0, extensionIndex), slugOpts);
    const extension = filename.substr(extensionIndex);
    return `${name}${extension}`;
  }
  return slug(filename, slugOpts);
};

export function fetchSignedPost(key: string, isPublic: boolean) {
  return callAPI({
    types: FileType.FETCH_SIGNED_POST,
    method: 'POST',
    endpoint: '/files/',
    body: {
      key: normalizeFilename(key),
      public: isPublic
    }
  });
}

export type UploadArgs = {
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
    dispatch(fetchSignedPost(fileName || file.name, isPublic)).then(action => {
      if (!action || !action.payload) return;
      return dispatch(
        callAPI({
          types: FileType.UPLOAD,
          method: 'POST',
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
      );
    });
}
