// @flow

import styles from './AppRoute.css';
import React, { PureComponent, type Element, cloneElement } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import Helmet from 'react-helmet';
import {
  loginAutomaticallyIfPossible,
  logoutWithRedirect,
  login
} from 'app/actions/UserActions';
import {
  fetchNotificationData,
  markAllNotifications
} from 'app/actions/NotificationsFeedActions';
import { fetchNotificationFeed } from 'app/actions/FeedActions';
import { fetchMeta } from 'app/actions/MetaActions';
import { selectFeedActivitesByFeedId } from 'app/reducers/feeds';
import { toggleSearch } from 'app/actions/SearchActions';
import ErrorBoundary from 'app/components/ErrorBoundary';
import Header from 'app/components/Header';
import Footer from 'app/components/Footer';
import ToastContainer from 'app/components/Toast/ToastContainer';
import PhotoUploadStatus from 'app/components/PhotoUploadStatus';
import { selectIsLoggedIn, selectCurrentUser } from 'app/reducers/auth';
import cx from 'classnames';
import HTTPError from '../errors/HTTPError';
import { setStatusCode } from 'app/actions/RoutingActions';
import config from 'app/config';
import coverPhoto from 'app/assets/cover.png';

type Props = {
  statusCode: number,
  location: any,
  children: Element<*>,
  currentUser: /*TODO: User*/ Object,
  setStatusCode: (code: ?number) => void,
  loggedIn: boolean
};

export const UserContext = React.createContext();

class AppChildren extends PureComponent<Props> {
  render() {
    const children = React.Children.map(this.props.children, child =>
      cloneElement(child, {
        passedProps: {
          currentUser: this.props.currentUser,
          loggedIn: this.props.loggedIn
        }
      })
    );

    const userValue = {
      currentUser: this.props.currentUser,
      loggedIn: this.props.loggedIn
    };

    return (
      <div style={{ flex: 1 }}>
        <ErrorBoundary resetOnChange={this.props.location}>
          <ToastContainer />
          {this.props.statusCode ? (
            <HTTPError
              statusCode={this.props.statusCode}
              setStatusCode={this.props.setStatusCode}
              location={this.props.location}
            />
          ) : (
            <UserContext.Provider value={userValue}>
              {children}
            </UserContext.Provider>
          )}
        </ErrorBoundary>
      </div>
    );
  }
}

// TODO: Type it
type AppProps = any;

class App extends PureComponent<AppProps> {
  render() {
    return (
      <div
        className={cx(styles.appRoute, {
          [styles.searchOpen]: this.props.searchOpen
        })}
      >
        <Helmet defaultTitle="Abakus.no" titleTemplate="%s | Abakus.no">
          <meta property="og:image" content={coverPhoto} />
          <meta
            property="og:description"
            content="Abakus er linjeforeningen for studentene ved Datateknologi og Kommunikasjonsteknologi på NTNU, og drives av studenter ved disse studiene."
          />
        </Helmet>

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

        <PhotoUploadStatus />

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
    statusCode: state.router.statusCode
  };
}

const mapDispatchToProps = {
  toggleSearch,
  logout: logoutWithRedirect,
  login,
  fetchNotificationFeed,
  markAllNotifications,
  fetchNotificationData,
  setStatusCode,
  loginAutomaticallyIfPossible
};

function fetchInitialOnServer(props, dispatch) {
  return dispatch(loginAutomaticallyIfPossible()).then(() =>
    Promise.all([
      dispatch(fetchMeta())
      //dispatch(fetchNotificationData()),
      //dispatch(fetchNotificationFeed())
    ])
  );
}

export default compose(
  prepare(fetchInitialOnServer, [], {
    componentDidMount: false,
    componentWillReceiveProps: false
  }),
  prepare((props, dispatch) => dispatch(fetchNotificationData())),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(App);
