import React from 'react';
import UserStore from '../stores/UserStore';

var AuthMixin = {

  getInitialState() {
    return {
      isLoggedIn: UserStore.isLoggedIn(),
      userInfo: UserStore.getUserInfo()
    };
  },

  componentDidMount() {
    UserStore.addChangeListener(this._onLoginChange);
  },

  componentWillUnmount() {
    UserStore.removeChangeListener(this._onLoginChange);
  },

  _onLoginChange() {
    this.setState({
      isLoggedIn: UserStore.isLoggedIn(),
      userInfo: UserStore.getUserInfo(),
      loginFailed: UserStore.didLoginFail()
    });
  }
};

export default AuthMixin;
