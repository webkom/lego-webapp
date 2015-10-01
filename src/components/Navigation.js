import React, { Component, PropTypes } from 'react';
import Icon from '../components/Icon';

import { Link } from 'react-router';
import CSSTransitionGroup from 'react-addons-css-transition-group';

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

export default class Navigation extends Component {
  static propTypes = {
    toggleMenu: PropTypes.func.isRequired,
    menuOpen: PropTypes.bool.isRequired
  };
  render() {
    const {menuOpen, toggleMenu} = this.props;
    return (
      <div>
        <nav className='MainNavigation'>
          <ul className='MainNavigation-list u-container'>
            <li>
              <a onClick={(e) => (e.stopPropagation(), toggleMenu())} className={menuOpen ? 'active' : ''}>
                <Icon name={menuOpen ? 'times' : 'bars'} />
              </a>
            </li>
          </ul>
        </nav>
        <CSSTransitionGroup transitionEnterTimeout={1} transitionLeaveTimeout={1} transitionName='menu'>
          {menuOpen && <div className='ExtendedNavigation-back' key='menu'>
            <div className='ExtendedNavigation u-container'>
            {MENU_ITEMS.map((item, i) => <Link to={item[0]} key={i}>{item[1]}</Link>)}
            </div>
          </div>}
        </CSSTransitionGroup>
      </div>
    );
  }
}
