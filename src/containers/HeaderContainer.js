import React, { Component } from 'react';

import Header from '../components/Header';
import { connect } from 'react-redux';
import { login, logout } from '../actions/UserActions';

@connect(
  (state) => ({
    search: state.search,
    auth: state.auth,
    loggedIn: state.auth.token !== null,
    menuOpen: state.ui.menuOpen,
    accountOpen: false,
    searchOpen: false
  }),
  { login, logout }
)
export default class HeaderContainer extends Component {
  render() {
    return <Header {...this.props}/>;
  }
}
