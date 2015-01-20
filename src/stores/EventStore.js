'use strict';

var {createStore, registerStore, Dispatcher} = require('lego-flux');

var EventStore = createStore({

  actions: {
    'RECEIVE_EVENTS': '_onReceiveEvents'
  },

  events: {},

  addEvents: function(events) {
    var that = this;
    events.forEach(function(event) {
      if (!that.events[event.id])
        that.events[event.id] = event;
    });
  },

  get: function(id) {
    return this.events[id] || {};
  },

  getAll: function() {
    return this.events;
  },

  getAllSorted: function() {
    var sorted = [];
    for (var id in this.events) {
      sorted.push(this.events[id]);
    }
    return sorted;
  },

  isEmpty: function() {
    return Object.keys(this.events).length === 0;
  },

  _onReceiveEvents(action) {
    this.addEvents(action.events);
    this.emitChange();
  }
});

registerStore(Dispatcher, EventStore);

module.exports = EventStore;
