var React = require('react');
var UserStore = require('../stores/UserStore');

var AuthMixin = {

  getInitialState: function() {
    return {
      isLoggedIn: false,
      userInfo: {}
    };
  },

  componentDidMount: function() {
    UserStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    UserStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState({
      isLoggedIn: UserStore.isLoggedIn(),
      userInfo: UserStore.getUserInfo(),
    });
  },
};

module.exports = AuthMixin;
