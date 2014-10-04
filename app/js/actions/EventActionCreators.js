var AppDispatcher = require('../AppDispatcher');
var EventActionTypes = require('../Constants').EventActionTypes;

module.exports = {

  receiveAll: function(events) {
    AppDispatcher.handleServerAction({
      type: EventActionTypes.RECEIVE_EVENTS,
      events: events
    });
  }
};
