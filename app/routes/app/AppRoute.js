// @flow

import styles from './AppRoute.css';
import React, { PureComponent } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';
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
import { selectFeedActivitesByFeedId } from 'app/reducers/feeds';
import { toggleSearch } from 'app/actions/SearchActions';
import Header from 'app/components/Header';
import Footer from 'app/components/Footer';
import NotificationContainer from 'app/components/NotificationContainer';
import { selectIsLoggedIn, selectCurrentUser } from 'app/reducers/auth';
import cx from 'classnames';

class AppChildren extends PureComponent {
  render() {
    return (
      <div style={{ flex: 1 }}>
        <NotificationContainer />
        {React.cloneElement(this.props.children, {
          currentUser: this.props.currentUser,
          loggedIn: this.props.loggedIn
        })}
      </div>
    );
  }
}

class App extends PureComponent {
  render() {
    Raven.setUserContext(this.props.currentUser);

    return (
      <div
        className={cx(styles.appRoute, {
          [styles.searchOpen]: this.props.searchOpen
        })}
      >
        <Helmet defaultTitle="Abakus.no" titleTemplate="%s | Abakus.no" />

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
        >
          {this.props.children}
        </AppChildren>

        <Footer />
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
    })
  };
}

const mapDispatchToProps = {
  toggleSearch,
  logout,
  login,
  fetchNotificationFeed,
  markNotification,
  markAllNotifications,
  fetchNotificationData
};

export default compose(
  dispatched((props, dispatch) => dispatch(loginAutomaticallyIfPossible()), {
    componentDidMount: false,
    componentWillReceiveProps: false
  }),
  dispatched((props, dispatch) => dispatch(fetchNotificationData())),
  connect(mapStateToProps, mapDispatchToProps)
)(App);
