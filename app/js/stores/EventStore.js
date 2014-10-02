var request = require('superagent');
var Store = require('./Store');

var store = [];
var isFetching = false;

module.exports = Store.create({
  fetch: function() {
    if (isFetching) return;
    isFetching = true;
    request.get('http://api.abakus.dev/events').auth('admin', 'testtest').end(function(res) {
      store = res.body;
      isFetching = false;
      this.emitChange();
    }.bind(this));
  },

  all: function() {
    return store;
  },

  where: function() {
  },

  find: function(id) {
    for (var i = 0; i < store.length; i++) {
      if (store[i].id === id) return store[i];
    }
    return null;
  },
});
