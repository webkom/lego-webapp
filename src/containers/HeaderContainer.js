import React, { Component } from 'react';

import Header from '../components/Header';
import { connect } from 'react-redux';
import { login, logout } from '../actions/UserActions';
import { clear, search } from '../actions/SearchActions';
import { toggleMenu } from '../actions/UIActions';
const performSearch = search;

@connect(
  (state) => ({
    search: state.search,
    auth: state.auth,
    loggedIn: state.auth.token !== null,
    menuOpen: state.ui.menuOpen
  }),
  { login, logout, clear, performSearch, toggleMenu }
)
export default class HeaderContainer extends Component {
  render() {
    return <Header {...this.props}/>;
  }
}
