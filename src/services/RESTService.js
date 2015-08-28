import request from 'superagent';
import camelize from 'camelize';
import config from '../../config.js';

/**
 * This module is basically a wrapper
 * around superagent to add some common stuff.
 */

const TIMEOUT = 10000;

/**
 * Construct a fully qualified API url for the given `resource`.
 * @param {string} resource
 */
function urlFor(resource) {
  return config.serverUrl + resource;
}

const _pendingRequests = {};

function abortPendingRequests(key) {
  if (_pendingRequests[key]) {
    _pendingRequests[key]._callback = () => {};
    _pendingRequests[key].abort();
    _pendingRequests[key] = null;
    console.log('Aborted request for %s', key);
  }
}

export function get(url) {
  return httpRequest('get', url);
}

export function post(url, json) {
  return httpRequest('post', url, json);
}

/**
 *
 */
export default function httpRequest(method, url, json) {
  abortPendingRequests(url);

  const req = request[method].call(request, urlFor(url));
  const user = JSON.parse(window.localStorage.getItem('user'));

  if (user) {
    req.set('Authorization', `Bearer ${user.token}`);
  }

  req.timeout(TIMEOUT);

  if (json) {
    req.send(json);
  }

  return new Promise((resolve, reject) => {
    _pendingRequests[url] = req.end((err, res) => {
      if (err) return reject(err);
      if (!res.ok) return reject(new Error(res.body));
      return resolve(camelize(res.body));
    });
  });
}
