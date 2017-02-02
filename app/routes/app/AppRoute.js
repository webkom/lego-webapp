// @flow

import styles from './AppRoute.css';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loginAutomaticallyIfPossible, logout } from 'app/actions/UserActions';
import { toggleSearch } from 'app/actions/SearchActions';
import Header from 'app/components/Header';
import Footer from 'app/components/Footer';
import LoadingIndicator from 'app/components/LoadingIndicator';
import NotificationContainer from 'app/components/NotificationContainer';
import { selectIsLoggedIn, selectCurrentUser } from 'app/reducers/auth';

class App extends Component {
  state = {
    ready: false
  };

  componentDidMount() {
    this.props.loginAutomaticallyIfPossible()
      .then(
        () => this.setState({ ready: true }),
        () => this.setState({ ready: true })
      );
  }

  render() {
    if (!this.state.ready) {
      return <LoadingIndicator loading />;
    }

    return (
      <div
        style={this.props.searchOpen ? { WebkitFilter: 'blur(10px)' } : null}
        className={styles.AppRoute}
      >
        <Header
          searchOpen={this.props.searchOpen}
          toggleSearch={this.props.toggleSearch}
          currentUser={this.props.currentUser}
          loggedIn={this.props.loggedIn}
          logout={this.props.logout}
        />

        <div style={{ flex: 1 }}>
          <NotificationContainer />
          {React.cloneElement(this.props.children, {
            currentUser: this.props.currentUser,
            loggedIn: this.props.loggedIn
          })}
        </div>

        <Footer />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    searchOpen: state.search.open,
    currentUser: selectCurrentUser(state),
    loggedIn: selectIsLoggedIn(state)
  };
}

const mapDispatchToProps = {
  loginAutomaticallyIfPossible,
  toggleSearch,
  logout
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
