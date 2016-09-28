// @flow

import '../../Root.css';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loginAutomaticallyIfPossible } from 'app/actions/UserActions';
import { toggleSearch } from 'app/actions/SearchActions';
import Header from 'app/components/Header';
import Footer from 'app/components/Footer';
import NotificationContainer from 'app/components/NotificationContainer';
import { selectIsLoggedIn, selectCurrentUser } from 'app/reducers/auth';

class App extends Component {
  componentDidMount() {
    this.props.loginAutomaticallyIfPossible();
  }

  render() {
    return (
      <div style={this.props.searchOpen ? { WebkitFilter: 'blur(10px)' } : null}>
        <Header
          searchOpen={this.props.searchOpen}
          toggleSearch={this.props.toggleSearch}
          currentUser={this.props.currentUser}
          loggedIn={this.props.loggedIn}
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
  toggleSearch
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
