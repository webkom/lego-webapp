import Dispatcher from 'lego-flux/lib/Dispatcher';

export default {

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
