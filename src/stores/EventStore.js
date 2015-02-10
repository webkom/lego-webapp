import createStore from './createStore';

const colors = {
  company_presentation: '#A1C34A',
  course: '#52B0EC',
  party: '#E8953A',
  regular: '#B11C11',
  other: '#333333'
};

var _events = {};

export default createStore({

  getState() {
    return {
      events: this.getAllSorted()
    };
  },

  addEvents(events) {
    events.forEach((event) => {
      _events[event.id] = event;
    });
  },

  get(id) {
    return _events[id] || {};
  },

  getAll() {
    return _events;
  },

  getAllSorted() {
    var sorted = [];
    for (var id in _events) {
      _events[id].color = colors[_events[id].type];
      sorted.push(_events[id]);
    }
    return sorted;
  },

  isEmpty() {
    return Object.keys(_events).length === 0;
  },

  actions: {
    eventsReceived(action) {
      this.addEvents(action.events);
      this.emitChange();
    }
  }
});
