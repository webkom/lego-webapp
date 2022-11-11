import slug from 'slugify';
import type { AppDispatch } from 'app/store/store';
import createLegoApiAction from 'app/store/utils/createLegoApiAction';

const slugifyFilename = (filename: string): string => {
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

interface FetchSignedPostSuccessPayload {
  url: string;
  file_key: string;
  file_token: string;
  fields: {
    success_action_redirect: string;
    acl: string;
    'Content-Type': string;
    key: string;
    'x-amz-algorithm': string;
    'x-amz-credential': string;
    'x-amz-date': string;
    policy: string;
    'x-amz-signature': string;
  };
}

export const fetchSignedPost =
  createLegoApiAction<FetchSignedPostSuccessPayload>()(
    'File.FETCH_SIGNED_POST',
    (_, key: string, isPublic: boolean) => ({
      method: 'POST',
      endpoint: '/files/',
      body: {
        key: slugifyFilename(key),
        public: isPublic,
      },
      meta: {
        errorMessage: 'Filopplasting feilet',
      },
    })
  );

const uploadFileWithSignedPost = createLegoApiAction()(
  'File.UPLOAD',
  (
    _,
    { file, timeout }: Pick<UploadArgs, 'file' | 'timeout'>,
    signedPostPayload: FetchSignedPostSuccessPayload
  ) => ({
    method: 'POST',
    endpoint: signedPostPayload.url,
    body: signedPostPayload.fields,
    files: [file],
    timeout,
    json: false,
    headers: {
      Accept: 'application/json',
    },
    requiresAuthentication: false,
    meta: {
      fileKey: signedPostPayload.file_key,
      fileToken: signedPostPayload.file_token,
      errorMessage: 'Filopplasting feilet',
    },
  })
);

export interface UploadArgs {
  file: File;
  fileName?: string;
  isPublic?: boolean;
  // Use big timeouts for big files. See app/utils/fetchJSON.js for more info
  // In ms. aka. 2sec = 2 * 1000;
  timeout?: number;
}

export const uploadFile =
  ({ file, fileName, isPublic = false, timeout }: UploadArgs) =>
  async (dispatch: AppDispatch) => {
    const signedPost = await dispatch(
      fetchSignedPost(fileName || file.name, isPublic)
    );
    return dispatch(
      uploadFileWithSignedPost({ file, timeout }, signedPost.payload)
    );
  };
