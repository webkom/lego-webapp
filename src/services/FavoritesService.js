'use strict';

/**
 * Dummy implementation of favorites.
 * Stores data in localStorage, but must store this on
 * the server as well.
 */
module.exports = {

  findAll: function(fn) {
    // not async atm, but will fetch from server soon
    var favorites = JSON.parse(window.localStorage.favorites || null) || [];
    fn(null, favorites);
  },

  addFavorite: function(favorite, fn) {
    var favorites = JSON.parse(window.localStorage.favorites || null) || [];
    favorites.push(favorite);
    window.localStorage.favorites = JSON.stringify(favorites);
    fn(null, favorite);
  }
};
