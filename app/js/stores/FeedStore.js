var request = require('superagent');
var Store = require('./Store');

var store = [];
var isFetching = false;

module.exports = Store.create({
  fetch: function() {
    if (isFetching) return;
    isFetching = true;
    request.get('/api/feed', function(res) {
      store = res.body;
      isFetching = false;
      this.emitChange();
    }.bind(this));
  },

  all: function() {
    return store;
  },

  where: function() {

  }
});
