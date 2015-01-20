'use strict';

var Dispatcher = require('lego-flux/lib/Dispatcher');

module.exports = {

  search: function(query) {
    Dispatcher.handleViewAction({
      type: 'SEARCH',
      query: query
    });
  },

  clear: function() {
    Dispatcher.handleViewAction({
      type: 'CLEAR_SEARCH'
    });
  }
};
