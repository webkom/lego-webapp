var request = require('superagent');

/**
 * This module is basically a wrapper
 * around superagent to add some common stuff.
 */

var API_URL = 'http://api.abakus.dev';

/**
 * Timeout for server requests
 */
var TIMEOUT = 10000;

/**
 * Construct a fully qualified API url for the given `resource`.
 * @param {string} resource
 */
var urlFor = function(resource) {
  return API_URL + resource;
};

module.exports = {

  get: function(url) {
    console.log('Sent a GET request to %s.', url);
    return request
      .get(urlFor(url))
      .timeout(TIMEOUT);
  },

  post: function(url) {
    return request
      .post(urlFor(url))
      .timeout(timeout);
  },

  put: function(url) {
    return request
      .put(urlFor(url))
      .timeout(timeout);
  },

  delete: function(url) {
    return request
      .delete(urlFor(url))
      .timeout(timeout);
  }
};
