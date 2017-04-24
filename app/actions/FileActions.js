import { File } from './ActionTypes';
import callAPI from './callAPI';

export function fetchSignedPost(key, isPublic) {
  return callAPI({
    types: File.FETCH_SIGNED_POST,
    method: 'post',
    endpoint: '/files/',
    body: {
      key,
      public: isPublic
    }
  });
}

export function uploadFile({ file, fileName, isPublic = false }) {
  return dispatch =>
    dispatch(fetchSignedPost(fileName || file.name, isPublic)).then(action =>
      dispatch(
        callAPI({
          types: File.UPLOAD,
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
      ));
}
