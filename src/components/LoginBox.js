'use strict';

var React = require('react/addons');
var UserViewActionCreators = require('../actions/UserViewActionCreators');
var UserStore = require('../stores/UserStore');
var AuthMixin = require('./AuthMixin');
var Icon  = require('./icon');

var LoginBox = React.createClass({

  mixins: [AuthMixin],

  getInitialState: function() {
    return {
      loginOpen: false,
    };
  },

  toggleLoginOpen: function() {
    this.setState({
      loginOpen: !this.state.loginOpen
    });

    if (!this.state.loginOpen)
      this.refs.username.getDOMNode().focus();
  },

  onLogin: function(event) {
    event.preventDefault();

    var username = this.refs.username.getDOMNode().value.trim();
    var password = this.refs.password.getDOMNode().value.trim();

    if (username === '') {
      this.refs.username.getDOMNode().focus();
      return;
    }

    if (password === '') {
      this.refs.password.getDOMNode().focus();
      return;
    }

    UserViewActionCreators.login(username, password);
  },

  render: function() {
    var cx = React.addons.classSet;
    return (
      <div className='login-container'>
        <p className="login-status">
          {this.state.isLoggedIn ?
            <div>
              <img className='gravatar' src='http://www.gravatar.com/avatar/279f5b4c5c781eb6aaa5c3f09c974acf.jpg?s=64&d=identicon' />
              <span>{this.state.userInfo.username}</span>
            </div>
            : <a onClick={this.toggleLoginOpen} className='login-button'><Icon name='lock'/>Logg inn</a>}
        </p>
        <div className={
          cx({
            'login-form': true,
            'hidden': (!this.state.loginOpen || this.state.isLoggedIn),
            'animated shake': this.state.loginFailed
          })
        }>
          <form onSubmit={this.onLogin}>
            <input type='text' ref='username' placeholder='Username' />
            <input type='password' ref='password' placeholder='Password' />
            <button type='submit'>Logg inn</button>
          </form>
        </div>
      </div>
    );
  }
});

module.exports = LoginBox;
