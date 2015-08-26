import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router';
import configureStore from '../configureStore';
import AppContainer from './AppContainer';
import EventsContainer from './EventsContainer';

const store = configureStore();

export default class RootContainer extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }

  render() {
    return (
      <Provider {...{ store }}>
        <Router history={this.props.history}>
          <Route path='/' component={AppContainer}>
            <Route path='events' component={EventsContainer} />
          </Route>
        </Router>
      </Provider>
    );
  }
}
