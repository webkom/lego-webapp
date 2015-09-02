import '../styles/App.css';
import React, { Component, PropTypes } from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import { Link } from 'react-router';
import { toggleMenu, closeMenu } from '../actions/UIActions';
import { login, logout } from '../actions/UserActions';
import Overview from '../components/Overview';
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
    children: PropTypes.array,
    auth: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    menuOpen: PropTypes.bool.isRequired,
    search: PropTypes.object.isRequired
  }

  render() {
    const { dispatch, menuOpen, search, auth, loggedIn } = this.props;

    return (
      <div className='Site' onClick={() => dispatch(closeMenu())}>
        <header className='Header'>
          <div className='Header-content u-container'>
            <div className='Header-logo'><Link to=''>Abakus</Link></div>
            <div className='Header-searchBox'><SearchBox {...{ search, dispatch }}/></div>
            <div className='Header-partnerLogo'><a href='http://bekk.no'>Bekk</a></div>
            <div className='Header-login'>
              {loggedIn
                ? <div onClick={() => dispatch(logout())}>{auth.username}</div>
                : <LoginForm login={(u, p) => dispatch(login(u, p))} />}
            </div>
          </div>
        </header>

        <nav className='MainNavigation'>
          <ul className='MainNavigation-list u-container'>
            <li>
              <a onClick={(e) => (e.stopPropagation(), dispatch(toggleMenu()))} className={menuOpen ? 'active' : ''}>
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

        {this.props.children || <Overview {...this.props} />}

        <footer className='Footer'>
          <div className='u-container'>
            <p>Abakus er best</p>
          </div>
        </footer>
      </div>
    );
  }
}
