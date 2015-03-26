import request from 'superagent-bluebird-promise';
import UserStore from '../stores/UserStore';
import config from '../../config.json';

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

/**
 *
 */
var methods = {};

['get', 'post', 'put', 'delete'].forEach(function(method) {
  methods[method] = function(url) {
    function apiRequest() {
      console.log('Sent a %s request to %s', method.toUpperCase(), url);
      return request[method].call(null, urlFor(url))
        .timeout(TIMEOUT);
    }

    if (UserStore.isLoggedIn()) {
      return apiRequest()
        .set('Authorization', UserStore.getTokenHeader());
    }

    return apiRequest();
  };
});

export default methods;
