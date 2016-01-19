import React, { Component } from 'react';

import Header from '../components/Header';
import { connect } from 'react-redux';
import { login, logout } from '../actions/UserActions';
import { search } from '../actions/SearchActions';

@connect(
  state => ({
    searchResults: state.search.results,
    searching: state.search.searching,
    auth: state.auth,
    loggedIn: state.auth.token !== null,
    loginFailed: state.auth.loginFailed
  }),
  { login, logout, search }
)
export default class HeaderContainer extends Component {
  render() {
    return <Header {...this.props} />;
  }
}
