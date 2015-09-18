import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loginAutomaticallyIfPossible } from '../actions/UserActions';
import App from '../components/App';
import { toggleMenu, closeMenu } from '../actions/UIActions';
import { login, logout } from '../actions/UserActions';
import { fetchAll } from '../actions/EventActions';
import { clear, search } from '../actions/SearchActions';
const performSearch = search;

@connect(
  (state) => ({
    menuOpen: state.ui.menuOpen,
    search: state.search,
    auth: state.auth,
    events: state.events.items,
    users: state.users,
    loggedIn: state.auth.token !== null
  }),
  { toggleMenu, closeMenu, login, logout, loginAutomaticallyIfPossible, fetchAll, clear, performSearch }
)
export default class AppContainer extends Component {

  static propTypes = {
    loginAutomaticallyIfPossible: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.loginAutomaticallyIfPossible();
  }

  render() {
    return <App {...this.props} />;
  }
}
