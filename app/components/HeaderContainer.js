import React, { Component } from 'react';

import Header from './Header';
import { connect } from 'react-redux';
import { login, logout } from 'app/actions/UserActions';
import { search } from 'app/actions/SearchActions';

@connect((state) => ({
  searchResults: state.search.results,
  searching: state.search.searching,
  auth: state.auth,
  loggedIn: state.auth.token !== null,
  loginFailed: state.auth.loginFailed
}), { login, logout, search }
)
export default class HeaderContainer extends Component {
  render() {
    return <Header {...this.props} />;
  }
}
