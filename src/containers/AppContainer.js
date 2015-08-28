import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { loginAutomaticallyIfPossible } from '../actions/UserActions';
import App from '../components/App';

@connect(state => ({
  menuOpen: state.ui.menuOpen,
  search: state.search,
  auth: state.users,
  events: state.events.items
}))
export default class AppContainer extends Component {

  componentWillMount() {
    this.props.dispatch(loginAutomaticallyIfPossible());
  }

  render() {
    return <App {...this.props} />;
  }
}
