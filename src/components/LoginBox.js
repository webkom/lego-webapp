import React from 'react/addons';
import UserActionCreators from '../actions/UserActionCreators';
import UserStore from '../stores/UserStore';
import AuthMixin from './AuthMixin';
import Icon from './Icon';

var LoginBox = React.createClass({

  mixins: [AuthMixin],

  getInitialState() {
    return {
      loginOpen: false
    };
  },

  toggleLoginOpen() {
    this.setState({
      loginOpen: !this.state.loginOpen
    });

    if (!this.state.loginOpen)
      this.refs.username.getDOMNode().focus();
  },

  onLogin(event) {
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

    UserActionCreators.login(username, password);
  },

  render() {
    var cx = React.addons.classSet;
    return (
      <div className='login-container'>
        <p className="login-status">
          {this.state.isLoggedIn ?
            <div>
              <img className='gravatar' src='http://www.gravatar.com/avatar/279f5b4c5c781eb6aaa5c3f09c974acf.jpg?s=64&d=identicon' />
              <span>{this.state.userInfo.username}</span>
            </div>
            : <a onClick={this.toggleLoginOpen} className='login-button'><Icon name='lock'/> Logg inn</a>}
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

export default LoginBox;
