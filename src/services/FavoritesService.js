import storage from '../localStorage';

/**
 * Dummy implementation of favorites.
 * Stores data in localStorage, but must store this on
 * the server as well.
 */

export function findAll(fn) {
  // not async atm, but will fetch from server soon
  var favorites = storage.getItem('favorites');
  fn(null, favorites);
}

export function addFavorite(favorite, fn) {
  var favorites = storage.getItem('favorites') || [];
  favorites.push(favorite);
  storage.setItem('favorites', favorites);
  fn(null, favorite);
}
