import '../styles/App.css';
import React, { Component, PropTypes } from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import { Link } from 'react-router';
import { toggleMenu, closeMenu } from '../actions/UIActions';
import { login } from '../actions/UserActions';
import Overview from '../components/Overview';
import SearchBox from '../components/SearchBox';
import LoginBox from '../components/LoginBox';
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
    dispatch: PropTypes.func.isRequired,
    menuOpen: PropTypes.bool.isRequired,
    search: PropTypes.object.isRequired
  }

  render() {
    const { dispatch, menuOpen, search, auth } = this.props;
    return (
      <div className='Site' onClick={() => dispatch(closeMenu())}>
        <header className='Header'>
          <div className='Header-content u-container'>
            <div className='Header-logo'><Link to=''>Abakus</Link></div>
            <div className='Header-searchBox'><SearchBox {...{ search, dispatch }}/></div>
            <div className='Header-partnerLogo'><a href='http://bekk.no'>Bekk</a></div>
            <div className='Header-login'>
              <LoginBox
                login={(u, p) => dispatch(login(u, p))}
                userInfo={auth.userInfo}
              />
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


        <div className='u-relative u-container'>
          <CSSTransitionGroup transitionName='menu'>
            {menuOpen && <div className='ExtendedNavigation' key='menu'>
              {MENU_ITEMS.map((item, i) => <Link to={item[0]} key={i}>{item[1]}</Link>)}
            </div>}
          </CSSTransitionGroup>
        </div>

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
