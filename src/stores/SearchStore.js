'use strict';

var createStore = require('./createStore');
var SearchActionTypes = require('../Constants').SearchActionTypes;

var _results = [];
var _closed = true;

var db = ["Bekk", "Itera", "Iterate", "Knowit", "Visma", "BearingPoint"];
function generateDummyResults() {
  var n = (Math.random() * 6)|0;
  var results = [];
  while (n--) results.push(db[(db.length*Math.random())|0]);
  return results;
}

var SearchStore = createStore({

  getResults() {
    return _results;
  },

  isClosed() {
    return _closed;
  }

}, function(payload) {
  var action = payload.action;
  switch (action.type) {
    case SearchActionTypes.SEARCH:
      _results = generateDummyResults();
      _closed = false;
      SearchStore.emitChange();
      break;

    case SearchActionTypes.CLEAR_SEARCH:
      _results = [];
      _closed = true;
      SearchStore.emitChange();
      break;

    case SearchActionTypes.RECEIVE_SEARCH_RESULTS:
      _results = action.results;
      SearchStore.emitChange();
      break;
  }

  return true;
});

module.exports = SearchStore;
