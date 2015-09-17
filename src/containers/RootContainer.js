import React, { Component, PropTypes } from 'react';
import { Router, Route } from 'react-router';
import { reduxRouteComponent } from 'redux-react-router';
import configureStore from '../configureStore';
import AppContainer from './AppContainer';
import EventsContainer from './EventsContainer';
import UserSettings from '../components/UserSettings';

const store = configureStore();

// 02/09/15: This will be deprecated in a few days
// according to acdlite (the author of redux-react-router)
// because it is no longer needed in react-router@1.0.0-beta4
const RouteComponent = reduxRouteComponent(store);

export default class RootContainer extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }

  render() {
    return (
      <Router history={this.props.history}>
        <Route component={RouteComponent}>
          <Route path='/' component={AppContainer}>
            <Route path='events' component={EventsContainer}  />
            <Route path='settings' component={UserSettings}  />
          </Route>
        </Route>
      </Router>
    );
  }
}
