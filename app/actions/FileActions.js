import { File } from './ActionTypes';
import callAPI from './callAPI';

export function fetchSignedPost(key) {
  return callAPI({
    types: File.FETCH_SIGNED_POST,
    method: 'post',
    endpoint: '/files/',
    body: {
      key
    }
  });
}

export function uploadFile(file, fileName) {
  return (dispatch) => dispatch(fetchSignedPost(fileName || file.name))
    .then((action) => dispatch(callAPI({
      types: File.UPLOAD,
      method: 'post',
      endpoint: action.payload.url,
      body: { ...action.payload.fields },
      files: [file],
      timeout: 0,
      json: false,
      headers: {
        'Accept': 'application/json',
      },
      requiresAuthentication: false,
      meta: {
        fileToken: action.payload.file_token
      }
    })));
}
