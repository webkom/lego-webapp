import Dispatcher from 'lego-flux/lib/Dispatcher';

export default {

  search(query) {
    Dispatcher.handleViewAction({
      type: 'SEARCH',
      query: query
    });
  },

  clear() {
    Dispatcher.handleViewAction({
      type: 'CLEAR_SEARCH'
    });
  }
};
