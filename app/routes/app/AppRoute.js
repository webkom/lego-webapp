// @flow

import type { Element } from 'react';
import { Children, cloneElement, createContext, PureComponent } from 'react';
import { Helmet } from 'react-helmet-async';
import { connect } from 'react-redux';
import cx from 'classnames';
import moment from 'moment-timezone';
import { compose } from 'redux';

import { fetchNotificationFeed } from 'app/actions/FeedActions';
import { fetchAll as fetchMeetings } from 'app/actions/MeetingActions';
import { fetchMeta } from 'app/actions/MetaActions';
import {
  fetchNotificationData,
  markAllNotifications,
} from 'app/actions/NotificationsFeedActions';
import { setStatusCode } from 'app/actions/RoutingActions';
import { toggleSearch } from 'app/actions/SearchActions';
import {
  login,
  loginAutomaticallyIfPossible,
  logoutWithRedirect,
} from 'app/actions/UserActions';
import coverPhoto from 'app/assets/cover.png';
import ErrorBoundary from 'app/components/ErrorBoundary';
import Footer from 'app/components/Footer';
import Header from 'app/components/Header';
import PhotoUploadStatus from 'app/components/PhotoUploadStatus';
import SpecialDay from 'app/components/SpecialDay';
import ToastContainer from 'app/components/Toast/ToastContainer';
import config from 'app/config';
import { selectCurrentUser, selectIsLoggedIn } from 'app/reducers/auth';
import { selectFeedActivitesByFeedId } from 'app/reducers/feeds';
import prepare from 'app/utils/prepare';
import HTTPError from '../errors/HTTPError';

import styles from './AppRoute.css';

type Props = {
  statusCode: number,
  location: any,
  children: Element<*>,
  currentUser: /*TODO: User*/ Object,
  setStatusCode: (code: ?number) => void,
  loggedIn: boolean,
};

export const UserContext = createContext<{
  currentUser: Object,
  loggedIn: boolean,
}>({
  currentUser: {},
  loggedIn: false,
});

class AppChildren extends PureComponent<Props> {
  render() {
    const children = Children.map(this.props.children, (child) =>
      cloneElement(child, {
        passedProps: {
          currentUser: this.props.currentUser,
          loggedIn: this.props.loggedIn,
        },
      })
    );

    const userValue = {
      currentUser: this.props.currentUser,
      loggedIn: this.props.loggedIn,
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
          [styles.searchOpen]: this.props.searchOpen,
        })}
      >
        <Helmet defaultTitle="Abakus.no" titleTemplate="%s | Abakus.no">
          <meta property="og:image" content={coverPhoto} />
          <meta
            property="og:description"
            content="Abakus er linjeforeningen for studentene ved Datateknologi og Kommunikasjonsteknologi på NTNU, og drives av studenter ved disse studiene."
          />
        </Helmet>

        <SpecialDay>
          {config.environment !== 'production' && (
            <div
              style={{
                backgroundColor: 'red',
                color: 'white',
                fontWeight: 'bold',
                padding: '10px',
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
            upcomingMeeting={this.props.upcomingMeeting}
            loading={this.props.loading}
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
        </SpecialDay>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const upcomingMeetings = Object.values(state.meetings.byId)
    .filter((meeting: any) => moment(meeting.endTime).isAfter(moment()))
    .sort((meetingA: any, meetingB: any) =>
      moment(meetingA.startTime).isAfter(moment(meetingB.startTime)) ? 1 : -1
    )
    .map((meeting: any) => meeting.id);
  return {
    searchOpen: state.search.open,
    currentUser: selectCurrentUser(state),
    loggedIn: selectIsLoggedIn(state),
    notificationsData: state.notificationsFeed,
    notifications: selectFeedActivitesByFeedId(state, {
      feedId: 'notifications',
    }),
    statusCode: state.router.statusCode,
    upcomingMeeting: upcomingMeetings.length ? upcomingMeetings[0] : undefined,
    loading: state.frontpage.fetching,
  };
};

const mapDispatchToProps = {
  toggleSearch,
  logout: logoutWithRedirect,
  login,
  fetchNotificationFeed,
  markAllNotifications,
  fetchNotificationData,
  setStatusCode,
  loginAutomaticallyIfPossible,
};

export default compose(
  prepare((_, dispatch) => dispatch(loginAutomaticallyIfPossible()), [], {
    componentDidMount: false,
    componentWillReceiveProps: false,
  }),
  prepare((_, dispatch) => dispatch(fetchMeta()), [], {
    componentDidMount: false,
    componentWillReceiveProps: false,
    awaitOnSsr: false,
  }),
  prepare(
    (props, dispatch) =>
      Promise.all([
        dispatch(fetchNotificationData()),
        dispatch((dispatch, getState) => {
          if (!selectIsLoggedIn(getState())) {
            return Promise.resolve();
          }
          return dispatch(
            fetchMeetings({
              dateAfter: moment().format('YYYY-MM-DD'),
            })
          );
        }),
      ]),
    [],
    { awaitOnSsr: false }
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(App);
