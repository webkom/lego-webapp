import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import SearchBox from '../components/SearchBox';
import LoginForm from '../components/LoginForm';
import Navigation from '../components/Navigation';


export default class Header extends Component {
  static propTypes = {
    search: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    clear: PropTypes.func.isRequired,
    performSearch: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    menuOpen: PropTypes.bool.isRequired,
    toggleMenu: PropTypes.func.isRequired
  };
  render() {
    const {search, clear, performSearch, auth, login, logout, loggedIn, menuOpen, toggleMenu} = this.props;
    return (
      <div>
        <header className='Header'>
          <div className='Header-content u-container'>
            <div className='Header-logo'><Link to=''>Abakus</Link></div>
            <div className='Header-searchBox'><SearchBox {...{ search, clear, performSearch }}/></div>
            <div className='Header-partnerLogo'><a href='http://bekk.no'>Bekk</a></div>
            <div className='Header-login'>
              {loggedIn
                ? <div onClick={logout}>{auth.username}</div>
                : <LoginForm login={login} />}
            </div>
          </div>
        </header>
        <Navigation menuOpen={menuOpen} toggleMenu={toggleMenu} />
      </div>
    );
  }
}
