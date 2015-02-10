import {createStore, registerStore, Dispatcher} from 'lego-flux';

var _results = [];
var _closed = true;

var db = 'Bekk,Itera,Iterate,Knowit,Visma,BearingPoint,Norkart'.split(',');
function generateDummyResults() {
  var n = (Math.random() * 6) | 0;
  var results = [];
  while (n--) results.push(db[(db.length * Math.random()) | 0]);
  return results;
}

var SearchStore = createStore({

  actions: {
    'SEARCH': '_onSearch',
    'CLEAR_SEARCH': '_onClearSearch',
    'RECEIVE_SEARCH_RESULTS': '_onReceiveSearchResults'
  },

  getResults: function() {
    return _results;
  },

  isClosed: function() {
    return _closed;
  },

  _onSearch: function() {
    _results = generateDummyResults();
    _closed = false;
    this.emitChange();
  },

  _onClearSearch: function() {
    _results = [];
    _closed = true;
    this.emitChange();
  },

  _onReceiveSearchResults: function(action) {
    _results = action.results;
    this.emitChange();
  }
});

registerStore(Dispatcher, SearchStore);

export default SearchStore;
