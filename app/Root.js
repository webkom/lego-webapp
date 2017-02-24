import 'animate.css/animate.css';
import 'minireset.css/minireset.css';
import 'app/styles/globals.css';

import React, { Component } from 'react';
import { Router } from 'react-router';
import { Provider } from 'react-redux';

export default class Root extends Component {
  render() {
    const { store, ...props } = this.props;
    return (
      <Provider {...{ store }}>
        <Router {...props} />
      </Provider>
    );
  }
}
