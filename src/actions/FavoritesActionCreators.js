'use strict';

var Dispatcher = require('lego-flux/lib/Dispatcher');
var FavoritesService = require('../services/FavoritesService');

module.exports = {

  receiveAll: function(favorites) {
    Dispatcher.handleServerAction({
      type: 'FAVORITES_RECEIVED',
      favorites: favorites
    });
  },

  addFavorite: function(favorite) {
    Dispatcher.handleViewAction({
      type: 'ADD_FAVORITE',
      favorite: favorite
    });

    FavoritesService.addFavorite(favorite, function(err, payload) {
      if (err) return this.addFavoriteFailed(err);
      return this.addFavoriteCompleted(payload);
    }.bind(this));
  },

  addFavoriteCompleted: function(favorite) {
    Dispatcher.handleServerAction({
      type: 'ADD_FAVORITE_COMPLETED',
      favorite: favorite
    });
  },

  addFavoriteFailed: function(err) {
    Dispatcher.handleServerAction({
      type: 'ADD_FAVORITE_FAILED',
      error: err
    });
  }
};
