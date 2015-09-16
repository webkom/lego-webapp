import '../styles/App.css';
import React, { Component, PropTypes } from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import { Link } from 'react-router';
import { toggleMenu, closeMenu } from '../actions/UIActions';
import Overview from '../components/Overview';
import Header from './Header';
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
    dispatch: PropTypes.func.isRequired,
    menuOpen: PropTypes.bool.isRequired,
    loginOpen: PropTypes.bool.isRequired,
    search: PropTypes.object.isRequired,
    loggedIn: PropTypes.bool.isRequired
  }

  renderChildren() {
    if (this.props.children) {
      return React.cloneElement(this.props.children, this.props);
    }

    return <Overview {...this.props} />;
  }

  render() {
    const { dispatch, menuOpen } = this.props;

    return (
      <div className='Site' onClick={() => dispatch(closeMenu())}>
        <Header {...this.props} />

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

        {this.renderChildren()}

        <footer className='Footer'>
          <div className='u-container'>
            <p>Abakus er best</p>
          </div>
        </footer>
      </div>
    );
  }
}
