import createStore from './createStore';

var _results = [];
var _closed = true;

var db = 'Bekk,Itera,Iterate,Knowit,Visma,BearingPoint,Norkart'.split(',');
function generateDummyResults() {
  var n = (Math.random() * 6) | 0;
  var results = [];
  while (n--) results.push(db[(db.length * Math.random()) | 0]);
  return results;
}

export default createStore({

  getResults() {
    return _results;
  },

  isClosed() {
    return _closed;
  },

  actions: {
    search() {
      _results = generateDummyResults();
      _closed = false;
      this.emitChange();
    },

    clearSearch() {
      _results = [];
      _closed = true;
      this.emitChange();
    },

    searchResultsReceived(action) {
      _results = action.results;
      this.emitChange();
    }
  }
});
