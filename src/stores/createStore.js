import {EventEmitter} from 'events';
import assign from 'object-assign';
import Dispatcher from '../Dispatcher';

const CHANGE_EVENT = 'change';

class Store {

  constructor() {
    assign(this, EventEmitter.prototype);
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
}

export default function createStore(methods) {
  var store = assign(new Store(), methods);
  Dispatcher.registerStore(store);
  return store;
}
