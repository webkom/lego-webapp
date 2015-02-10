import Dispatcher from 'lego-flux/lib/Dispatcher';
import FavoritesService from '../services/FavoritesService';

export default {

  receiveAll(favorites) {
    Dispatcher.handleServerAction({
      type: 'FAVORITES_RECEIVED',
      favorites: favorites
    });
  },

  addFavorite(favorite) {
    Dispatcher.handleViewAction({
      type: 'ADD_FAVORITE',
      favorite: favorite
    });

    FavoritesService.addFavorite(favorite, function(err, payload) {
      if (err) return this.addFavoriteFailed(err);
      return this.addFavoriteCompleted(payload);
    }.bind(this));
  },

  addFavoriteCompleted(favorite) {
    Dispatcher.handleServerAction({
      type: 'ADD_FAVORITE_COMPLETED',
      favorite: favorite
    });
  },

  addFavoriteFailed(err) {
    Dispatcher.handleServerAction({
      type: 'ADD_FAVORITE_FAILED',
      error: err
    });
  }
};
