import {createStore, registerStore, Dispatcher} from 'lego-flux';

var FavoritesStore = createStore({

  actions: {
    'FAVORITES_RECEIVED': '_onFavoritesReceived'
  },

  favorites: [],

  getState() {
    return {
      favorites: this.favorites
    };
  },

  getAll() {
    return this.favorites;
  },

  _onFavoritesReceived(action) {
    this.favorites = action.favorites;
    this.emitChange();
  },
});

registerStore(Dispatcher, FavoritesStore);

export default FavoritesStore;
