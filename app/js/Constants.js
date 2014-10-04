/**
 * This file holds all the constants that are used in a Flux app
 *
 * Conventions:
 *   RECEIVE_* Something is coming from the server (server action)
 *   CLICK_* Something is clicked (view action)
 */

module.exports = {

  UserActionTypes: {
    LOGIN: 'LOGIN',
    RECEIVE_USER_INFO: 'RECEIVE_USER_INFO'
  },

  EventActionTypes: {
    RECEIVE_EVENTS: 'RECEIVE_EVENTS',
    CLICK_JOIN: 'CLICK_JOIN',
  }
};
