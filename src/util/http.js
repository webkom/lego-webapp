import superagent from 'superagent';
import camelize from 'camelize';
import config from '../../config.js';

function urlFor(resource) {
  if (resource.match(/^\/\//)) {
    return config.baseUrl + resource.replace(/^\//, '');
  }
  return config.serverUrl + resource;
}

export default function request({ method = 'get', url, body, headers = {}, jwtToken }) {
  const req = superagent[method].call(request, urlFor(url));

  if (jwtToken) {
    headers.Authorization = `JWT ${jwtToken}`;
  }

  for (const header in headers) {
    req.set(header, headers[header]);
  }

  if (body) {
    req.send(body);
  }

  return new Promise((resolve, reject) => {
    req.end((err, res) => {
      if (err) return reject(err);
      if (!res.ok) return reject(new Error(res.body));
      return resolve(camelize(res.body));
    });
  });
}

export function get(url) {
  return request({ method: 'get', url });
}

export function post(url, body) {
  return request({ method: 'post', url, body });
}

export function put(url, body) {
  return request({ method: 'put', url, body });
}

export function del(url, body) {
  return request({ method: 'delete', url, body });
}

export function callAPI(action) {
  return (dispatch, getState) => {
    const { method, endpoint, body } = action;
    const options = {
      method,
      url: endpoint,
      body
    };

    const jwt = getState().auth.token;
    if (jwt) {
      options.headers = {
        'Authorization': `JWT ${jwt}`
      };
    }

    return dispatch({
      type: action.type,
      promise: request(options)
    });
  };
}
