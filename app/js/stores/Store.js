var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

var CHANGE_EVENT = 'change';

module.exports = {
  create: function(store) {
    return merge(EventEmitter.prototype, merge(store, {
      emitChange: function() {
        this.emit(CHANGE_EVENT)
      },

      addChangeListener: function(fn) {
        this.on(CHANGE_EVENT, fn);
      },

      removeChangeListener: function(fn) {
        this.removeListener(CHANGE_EVENT, fn);
      }
    }));
  }
}
