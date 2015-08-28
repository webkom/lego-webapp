import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import Icon from './Icon';

export default class LoginBox extends Component {

  static propTypes = {
    userInfo: PropTypes.object,
    login: PropTypes.func.isRequired
  }

  handleSubmit(e) {
    e.preventDefault();

    const username = this.refs.username.value.trim();
    const password = this.refs.password.value.trim();

    if (username === '') {
      this.refs.username.focus();
      return;
    }

    if (password === '') {
      this.refs.password.focus();
      return;
    }

    this.props.login(username, password);
  }

  renderLoginStatus() {
    const { userInfo } = this.props;
    const loggedIn = userInfo !== null;

    if (!loggedIn) {
      return <a className='login-button'><Icon name='lock' /> Logg inn</a>;
    }
    return (
      <div>
        <img className='gravatar' src='http://www.gravatar.com/avatar/279f5b4c5c781eb6aaa5c3f09c974acf.jpg?s=64&d=identicon' />
        <span>{userInfo.username}</span>
      </div>
    );
  }

  render() {
    const { loginOpen, userInfo } = this.props;
    return (
      <div className='Login'>
        <div className='Login-status'>
          {this.renderLoginStatus()}
        </div>

        <form className={cx({
          'LoginBox-form': true,
          'hidden': userInfo !== null,
        })} onSubmit={::this.handleSubmit}>
          <input type='text' ref='username' placeholder='Username' />
          <input type='password' ref='password' placeholder='Password' />
          <button type='submit'>Logg inn</button>
        </form>
      </div>
    )
  }
}
