import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAll } from 'app/actions/EventActions';
import Overview from './components/Overview';

@connect((state) => ({
  events: state.events.items,
  loggedIn: state.auth.token !== null
}), { fetchAll })
export default class OverviewContainer extends Component {
  render() {
    return <Overview {...this.props} />;
  }
}
