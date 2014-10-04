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

/**
 *
 */
['get', 'post', 'put', 'delete'].forEach(function(method) {
  exports[method] = function(url) {
    console.log('Sent a %s request to %s', method.toUpperCase(), url);
    return request[method].call(null, urlFor(url))
      .timeout(TIMEOUT);
  };
});
