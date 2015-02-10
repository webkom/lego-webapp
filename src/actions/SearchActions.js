import createActions from './createActions';

export default createActions({

  search(query) {
    return {query};
  },

  clear() {
    return {
      type: 'clearSearch'
    };
  }
});
