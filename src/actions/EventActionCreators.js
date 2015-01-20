'use strict';

var Dispatcher = require('lego-flux/lib/Dispatcher');

module.exports = {

  receiveAll: function(events) {
    Dispatcher.handleServerAction({
      type: 'RECEIVE_EVENTS',
      events: events
    });
  }
};
