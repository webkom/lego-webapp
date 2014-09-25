var request = require('superagent');
var Store = require('./Store');

var articles = [];
var isFetching = false;

module.exports = Store.create({
  fetch: function() {
    if (isFetching) return;
    isFetching = true;
    request.get('/api/articles', function(res) {
      articles = res.body;
      isFetching = false;
      this.emitChange();
    }.bind(this));
  },

  all: function() {
    return articles;
  },

  where: function() {

  }
});
