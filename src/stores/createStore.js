var {EventEmitter} = require('events');
var assign = require('object-assign');
var AppDispatcher = require('../dispatcher/AppDispatcher');

var CHANGE_EVENT = 'change';

/**
 * Create a base store with common methods
 * and register it on the dispatcher.
 *
 * @param object methods
 * @param Function dispatchCallback
 */
function createStore(methods, dispatchCallback) {
	var store = assign({}, EventEmitter.prototype, {

	  emitChange() {
      this.emit(CHANGE_EVENT);
    },

    addChangeListener(callback) {
      this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener(callback) {
      this.removeListener(CHANGE_EVENT, callback);
    }

	}, methods);

	store.dispatchToken = AppDispatcher.register(dispatchCallback);
	return store;
}

module.exports = createStore;