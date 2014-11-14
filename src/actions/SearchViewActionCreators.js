var AppDispatcher = require('../dispatcher/AppDispatcher');
var SearchActionTypes = require('../Constants').SearchActionTypes;

module.exports = {

  search: function(query) {
    AppDispatcher.handleViewAction({
      type: SearchActionTypes.SEARCH,
      query: query
    });
  },

  clear: function() {
    AppDispatcher.handleViewAction({
      type: SearchActionTypes.CLEAR_SEARCH
    });
  }
};
