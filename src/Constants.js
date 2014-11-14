'use strict';

/**
 * All action types should be defined in this file
 * and referenced in the ActionCreators.
 *
 * Server actions should typically be prefixed with RECEIVE_
 */
var Constants = {

  UserActionTypes: {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    FAILED_LOGIN: 'FAILED_LOGIN',
    RECEIVE_USER_INFO: 'RECEIVE_USER_INFO'
  },

  EventActionTypes: {
    RECEIVE_EVENTS: 'RECEIVE_EVENTS',
    CLICK_JOIN: 'CLICK_JOIN',
  },

  SearchActionTypes: {
    SEARCH: 'SEARCH',
    CLEAR_SEARCH: 'CLEAR_SEARCH',
    RECEIVE_SEARCH_RESULTS: 'RECEIVE_SEARCH_RESULTS'
  }
};

module.exports = Constants;
