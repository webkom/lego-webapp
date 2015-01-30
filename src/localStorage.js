'use strict';

module.exports = {

  setItem: function(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  },

  getItem: function(key) {
    return JSON.parse(window.localStorage.getItem(key));
  }
};
