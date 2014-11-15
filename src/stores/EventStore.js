'use strict';

var createStore = require('./createStore');
var EventActionTypes = require('../Constants').EventActionTypes;

var _events = {};

function _addEvents(events) {
  events.forEach(function(event) {
    if (!_events[event.id]) {
      _events[event.id] = event;
    }
  });
}

var EventStore = createStore({

  get(id) {
    return _events[id] || {};
  },

  getAll() {
    return _events;
  },

  getAllSorted() {
    var sorted = [];
    for (var id in _events) {
      sorted.push(_events[id]);
    }
    return sorted;
  },

  isEmpty() {
    return Object.keys(_events).length === 0;
  }

}, function(payload) {

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