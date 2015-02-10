import {setItem, getItem} from '../localStorage';

/**
 * Dummy implementation of favorites.
 * Stores data in localStorage, but must store this on
 * the server as well.
 */

export function findAll(fn) {
  // not async atm, but will fetch from server soon
  var favorites = getItem('favorites');
  fn(null, favorites);
}

export function addFavorite(favorite, fn) {
  var favorites = getItem('favorites') || [];
  favorites.push(favorite);
  setItem('favorites', favorites);
  fn(null, favorite);
}
