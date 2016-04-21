/** @flow */

import styles from './Header.css';
import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';

import Icon from './Icon';

type State = {
  searchOpen: boolean;
};

type Props = {
  children: any;
  auth: any;
  login: () => any;
  logout: () => any;
  loggedIn: boolean;
  loginFailed: boolean;
};

export default class Header extends Component {
  props: Props;

  state: State = {
    searchOpen: false
  };

  render() {
    return (
      <header className='Header'>
        <div className='Header__content'>
          <IndexLink to='/' className='Header__logo'>
            <img src='/images/logo_dark.png' />
          </IndexLink>

          <div className='Header__navigation'>
            <div>
              <Link to='/events'>Arrangementer</Link>
              <Link to=''>Karriere</Link>
            </div>
            <div className='SearchBox'>
              <Icon name='search' />
              <input placeholder='Søk...' className='SearchBox__input' />
            </div>
            <div>
              <Link to=''>README</Link>
              <Link to='/quotes'>Sitater</Link>
            </div>
          </div>
        </div>
      </header>
    );
  }
}
