'use strict';

var storage = require('../localStorage');

/**
 * Dummy implementation of favorites.
 * Stores data in localStorage, but must store this on
 * the server as well.
 */
module.exports = {

  findAll: function(fn) {
    // not async atm, but will fetch from server soon
    var favorites = storage.getItem('favorites');
    fn(null, favorites);
  },

  addFavorite: function(favorite, fn) {
    var favorites = storage.getItem('favorites') || [];
    favorites.push(favorite);
    storage.setItem('favorites', favorites);
    fn(null, favorite);
  }
};
