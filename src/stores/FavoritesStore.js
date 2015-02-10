import createStore from './createStore';

var _favorites = [];

export default createStore({

  getState() {
    return {
      favorites: _favorites
    };
  },

  getAll() {
    return _favorites;
  },

  actions: {
    favoritesReceived(action) {
      _favorites = action.favorites;
      this.emitChange();
    }
  }
});
