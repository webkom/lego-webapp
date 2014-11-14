'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventActionTypes = require('../Constants').EventActionTypes;

module.exports = {

  receiveAll: function(events) {
    AppDispatcher.handleServerAction({
      type: EventActionTypes.RECEIVE_EVENTS,
      events: events
    });
  }
};
