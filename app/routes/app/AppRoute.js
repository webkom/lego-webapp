// @flow

import styles from './AppRoute.css';
import React, { PureComponent, type Element } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from '@webkom/react-prepare';
import Helmet from 'react-helmet';
import Raven from 'raven-js';
import {
  loginAutomaticallyIfPossible,
  logout,
  login
} from 'app/actions/UserActions';
import {
  fetchNotificationData,
  markAllNotifications,
  markNotification
} from 'app/actions/NotificationsFeedActions';
import { fetchNotificationFeed } from 'app/actions/FeedActions';
import { fetchMeta } from 'app/actions/MetaActions';
import { selectFeedActivitesByFeedId } from 'app/reducers/feeds';
import { toggleSearch } from 'app/actions/SearchActions';
import Header from 'app/components/Header';
import Footer from 'app/components/Footer';
import NotificationContainer from 'app/components/NotificationContainer';
import { selectIsLoggedIn, selectCurrentUser } from 'app/reducers/auth';
import cx from 'classnames';
import HTTPError from '../errors/HTTPError';
import { setStatusCode } from 'app/actions/RoutingActions';
import config from 'app/config';

type Props = {
  statusCode: number,
  location: any,
  children: Element<*>,
  currentUser: /*TODO: User*/ Object,
  setStatusCode: (code: ?number) => void,
  loggedIn: boolean
};

class AppChildren extends PureComponent<Props> {
  render() {
    return (
      <div style={{ flex: 1 }}>
        <NotificationContainer />
        {this.props.statusCode ? (
          <HTTPError
            statusCode={this.props.statusCode}
            setStatusCode={this.props.setStatusCode}
            location={this.props.location}
          />
        ) : (
          React.cloneElement(this.props.children, {
            currentUser: this.props.currentUser,
            loggedIn: this.props.loggedIn
          })
        )}
      </div>
    );
  }
}

// TODO: Type it
type AppProps = any;

class App extends PureComponent<AppProps> {
  componentWillReceiveProps(nextProps: Props) {
    Raven.setUserContext(nextProps.currentUser);
  }

  render() {
    return (
      <div
        className={cx(styles.appRoute, {
          [styles.searchOpen]: this.props.searchOpen
        })}
      >
        <Helmet defaultTitle="Abakus.no" titleTemplate="%s | Abakus.no" />

        {config.environment !== 'production' && (
          <div
            style={{
              backgroundColor: 'red',
              color: 'white',
              fontWeight: 'bold',
              padding: '10px'
            }}
          >
            This is a development version of lego-webapp.
          </div>
        )}

        <Header
          searchOpen={this.props.searchOpen}
          toggleSearch={this.props.toggleSearch}
          currentUser={this.props.currentUser}
          loggedIn={this.props.loggedIn}
          logout={this.props.logout}
          login={this.props.login}
          notificationsData={this.props.notificationsData}
          fetchNotifications={this.props.fetchNotificationFeed}
          notifications={this.props.notifications}
          markNotification={this.props.markNotification}
          markAllNotifications={this.props.markAllNotifications}
          fetchNotificationData={this.props.fetchNotificationData}
        />

        <AppChildren
          currentUser={this.props.currentUser}
          loggedIn={this.props.loggedIn}
          statusCode={this.props.statusCode}
          setStatusCode={this.props.setStatusCode}
          location={this.props.location}
        >
          {this.props.children}
        </AppChildren>

        <Footer {...this.props} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    searchOpen: state.search.open,
    currentUser: selectCurrentUser(state),
    loggedIn: selectIsLoggedIn(state),
    notificationsData: state.notificationsFeed,
    notifications: selectFeedActivitesByFeedId(state, {
      feedId: 'notifications'
    }),
    statusCode: state.routing.statusCode
  };
}

function fetchInitialOnServer(props, dispatch) {
  return dispatch(loginAutomaticallyIfPossible(props.getCookie)).then(() =>
    dispatch(fetchMeta())
  );
}

const mapDispatchToProps = {
  toggleSearch,
  logout,
  login,
  fetchNotificationFeed,
  markNotification,
  markAllNotifications,
  fetchNotificationData,
  setStatusCode
};

export default compose(
  dispatched(fetchInitialOnServer, {
    componentDidMount: false,
    componentWillReceiveProps: false
  }),
  dispatched((props, dispatch) => dispatch(fetchNotificationData())),
  connect(mapStateToProps, mapDispatchToProps)
)(App);
