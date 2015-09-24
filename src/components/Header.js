import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import cx from 'classnames';
import { toggleLogin } from '../actions/UIActions';
import { login, logout } from '../actions/UserActions';
import SearchBox from './SearchBox';
import LoginForm from './LoginForm';

function LoginBox({ loggedIn, user, onLogout, loginOpen, openLogin, ...rest }) {
  if (loggedIn) {
    return <div onClick={onLogout}>{user.username}</div>;
  }
  return (
    <div className={cx('LoginBox', !loginOpen && 'is-hidden')}>
      <LoginForm {...rest} />
      <button className='LoginBox__loginButton' onClick={openLogin}>Login</button>
    </div>
  );
}

export default class Header extends Component {
  static propTypes = {
    children: PropTypes.array,
    auth: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    loginOpen: PropTypes.bool.isRequired,
    search: PropTypes.object.isRequired,
    loggedIn: PropTypes.bool.isRequired
  }

  render() {
    const { dispatch, search, auth, loggedIn } = this.props;
    return (
      <header className='Header'>
        <div className='Header-content u-container'>
          <div className='Header-logo'><Link to=''>Abakus</Link></div>
          <div className='Header-searchBox'><SearchBox {...{ search, dispatch }}/></div>
          <div className='Header-partnerLogo'><a href='http://bekk.no'>Bekk</a></div>
          <div className='Header-login'>
            <LoginBox
              loggedIn={loggedIn}
              user={auth.user}
              login={(u, p) => dispatch(login(u, p))}
              onLogout={() => dispatch(logout())}
              loginOpen={this.props.loginOpen}
              openLogin={() => dispatch(toggleLogin())}
            />
          </div>
        </div>
      </header>
    );
  }
}
