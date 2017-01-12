import React, { Component } from 'react';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import routes from 'app/routes';
import './Root.css';
import 'nprogress/nprogress.css';

export default class Root extends Component {
  render() {
    const { store, history } = this.props;
    return (
      <Provider {...{ store }}>
        <Router {...{ history, routes }} />
      </Provider>
    );
  }
}
