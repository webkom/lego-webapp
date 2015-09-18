import '../styles/App.css';
import React, { Component, PropTypes } from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import { Link } from 'react-router';
import SearchBox from '../components/SearchBox';
import LoginForm from '../components/LoginForm';
import Icon from '../components/Icon';

const MENU_ITEMS = [
  ['/events', 'Arrangementer'],
  ['', 'readme'],
  ['', 'Karriere'],
  ['', 'BDB'],
  ['', 'Møter'],
  ['', 'Utland'],
  ['', 'Spørreskjema'],
  ['', 'Butikk']
];

export default class App extends Component {

  static propTypes = {
    children: PropTypes.any,
    auth: PropTypes.object.isRequired,
    menuOpen: PropTypes.bool.isRequired,
    search: PropTypes.object.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    closeMenu: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    toggleMenu: PropTypes.func.isRequired,
    fetchAll: PropTypes.func.isRequired,
    clear: PropTypes.func.isRequired,
    performSearch: PropTypes.func.isRequired
  }

  render() {
    const { menuOpen, search, auth, loggedIn, closeMenu, logout, login, toggleMenu, clear, performSearch } = this.props;

    return (
      <div className='Site' onClick={closeMenu}>
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

        <nav className='MainNavigation'>
          <ul className='MainNavigation-list u-container'>
            <li>
              <a onClick={(e) => (e.stopPropagation(), toggleMenu())} className={menuOpen ? 'active' : ''}>
                <Icon name={menuOpen ? 'times' : 'bars'} />
              </a>
            </li>
          </ul>
        </nav>

        <CSSTransitionGroup transitionName='menu'>
          {menuOpen && <div className='ExtendedNavigation-back' key='menu'>
            <div className='ExtendedNavigation u-container'>
            {MENU_ITEMS.map((item, i) => <Link to={item[0]} key={i}>{item[1]}</Link>)}
            </div>
          </div>}
        </CSSTransitionGroup>

        {React.cloneElement(this.props.children, this.props)}

        <footer className='Footer'>
          <div className='u-container'>
            <p>Abakus er best</p>
          </div>
        </footer>
      </div>
    );
  }
}
