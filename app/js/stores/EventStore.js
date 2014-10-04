var Store = require('./Store');
var AppDispatcher = require('../AppDispatcher');
var EventActionTypes = require('../Constants').EventActionTypes;

var _events = {};

function _addEvents(events) {
  events.forEach(function(event) {
    if (!_events[event.id]) {
      _events[event.id] = event;
    }
  });
}

var EventStore = Store.create({

  get: function(id) {
    return _events[id] || {};
  },

  getAll: function() {
    return _events;
  },

  getAllSorted: function() {
    var sorted = [];
    for (var id in _events) {
      sorted.push(_events[id]);
    }
    return sorted;
  }
});

EventStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;
  switch (action.type) {
    case EventActionTypes.RECEIVE_EVENTS:
      _addEvents(action.events);
      EventStore.emitChange();
      break;
  }

  return true;
});

module.exports = EventStore;
