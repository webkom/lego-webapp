'use strict';

var Store = require('./Store');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var SearchActionTypes = require('../Constants').SearchActionTypes;

var _results = [];
var _closed = true;

var SearchStore = Store.create({
  getResults: function() {
    return _results;
  },

  isClosed: function() {
    return _closed;
  }
});

var db = ["Bekk", "Itera", "Iterate", "Knowit", "Visma", "BearingPoint"];
function generateDummyResults() {
  var n = (Math.random() * 6)|0;
  var results = [];
  while (n--) results.push(db[(db.length*Math.random())|0]);
  return results;
}

SearchStore.dispatchToken = AppDispatcher.register(function(payload) {
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
