import React from 'react';
import UserStore from '../stores/UserStore';

var AuthMixin = {

  getInitialState: function() {
    return {
      isLoggedIn: UserStore.isLoggedIn(),
      userInfo: UserStore.getUserInfo()
    };
  },

  componentDidMount: function() {
    UserStore.addChangeListener(this._onLoginChange);
  },

  componentWillUnmount: function() {
    UserStore.removeChangeListener(this._onLoginChange);
  },

  _onLoginChange: function() {
    this.setState({
      isLoggedIn: UserStore.isLoggedIn(),
      userInfo: UserStore.getUserInfo(),
      loginFailed: UserStore.didLoginFail()
    });
  }
};

export default AuthMixin;
