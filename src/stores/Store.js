var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

/**
 * Generic Store
 *
 * This is the base store from which all other stores should inherit.
 * It provides some common functionality for adding, removing and emiting
 * change events.
 */

module.exports = {
  create: function(store) {
    return assign({}, EventEmitter.prototype, {
      emitChange: function() {
        this.emit(CHANGE_EVENT);
      },

      addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
      },

      removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
      },
    }, store);
  }
};
