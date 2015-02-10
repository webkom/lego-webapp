import createActions from './createActions';
import * as FavoritesService from '../services/FavoritesService';

export default createActions({

  receiveAll(favorites) {
    return {
      type: 'favoritesReceived',
      favorites
    };
  },

  addFavorite(favorite) {
    FavoritesService.addFavorite(favorite, function(err, payload) {
      if (err) return this.addFavoriteFailed(err);
      return this.addFavoriteCompleted(payload);
    }.bind(this));

    return {favorite};
  },

  addFavoriteCompleted(favorite) {
    return {favorite};
  },

  addFavoriteFailed(err) {
    return {err};
  }
});
