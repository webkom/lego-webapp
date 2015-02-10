export default {

  setItem(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  },

  getItem(key) {
    return JSON.parse(window.localStorage.getItem(key));
  }
};
