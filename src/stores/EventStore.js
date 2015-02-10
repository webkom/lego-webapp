import {createStore, registerStore, Dispatcher} from 'lego-flux';

const colors = {
  company_presentation: '#A1C34A',
  course: '#52B0EC',
  party: '#E8953A',
  regular: '#B11C11',
  other: '#333333'
};

var EventStore = createStore({

  actions: {
    'RECEIVE_EVENTS': '_onReceiveEvents'
  },

  events: {},

  getState() {
    return {
      events: this.getAllSorted()
    };
  },

  addEvents(events) {
    var self = this;
    events.forEach(function(event) {
      if (!self.events[event.id])
        self.events[event.id] = event;
    });
  },

  get(id) {
    return this.events[id] || {};
  },

  getAll() {
    return this.events;
  },

  getAllSorted() {
    var sorted = [];
    for (var id in this.events) {
      this.events[id].color = colors[this.events[id].type];
      sorted.push(this.events[id]);
    }
    return sorted;
  },

  isEmpty() {
    return Object.keys(this.events).length === 0;
  },

  _onReceiveEvents(action) {
    this.addEvents(action.events);
    this.emitChange();
  }
});

registerStore(Dispatcher, EventStore);

export default EventStore;
