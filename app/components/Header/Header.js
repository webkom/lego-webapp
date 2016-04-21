/** @flow */

import './Header.css';
import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import { Modal } from 'react-overlays';
import LoginForm from '../LoginForm';
import Search from '../Search';
import ButtonTriggeredDropdown from '../ButtonTriggeredDropdown';

type Props = {
  children: any;
  auth: any;
  login: () => any;
  logout: () => any;
  loggedIn: boolean;
  loginFailed: boolean;
};

type State = {
  accountOpen: boolean;
  searchOpen: boolean;
  notificationsOpen: boolean;
};

export default class Header extends Component {
  props: Props;

  state: State = {
    accountOpen: false,
    searchOpen: false,
    notificationsOpen: false
  };

  render() {
    const {
      auth,
      login, logout,
      loggedIn, loginFailed
    } = this.props;

    return (
      <header className='Header'>
        <div className='Header__content u-container'>
          <IndexLink to='/' className='Header__logo'>Abakus</IndexLink>

          <div className='Header__navigation'>
            <Link to='/events' activeClassName='active'>Arrangementer</Link>
            <Link to='/career' activeClassName='active'>Karriere</Link>
            <Link to='/readme' activeClassName='active'>README</Link>
            <Link to='/quotes' activeClassName='active'>Sitater</Link>
          </div>

          <div>
            <ButtonTriggeredDropdown
              buttonClassName='Header__content__button'
              iconName='bell'
              show={this.state.notificationsOpen}
              toggle={() => this.setState({
                notificationsOpen: !this.state.notificationsOpen
              })}
            >
              <h2>No Notifications</h2>
            </ButtonTriggeredDropdown>

            <ButtonTriggeredDropdown
              buttonClassName='Header__content__button'
              contentClassName={auth.loggingIn && loginFailed ? 'animated shake' : ''}
              iconName='user'
              show={this.state.accountOpen}
              toggle={() => this.setState({ accountOpen: !this.state.accountOpen })}
            >
              {!loggedIn && (
                <LoginForm login={login} />
              )}

              {loggedIn && (
                <div>
                  <h2>{auth && auth.username}</h2>
                  <ul className='Dropdown__content__menu'>
                    <li><Link to='/users/me'>My Profile</Link></li>
                    <li><Link to='/users/me/settings'>Settings</Link></li>
                    <li><Link to='events'>Favorites</Link></li>
                    <li><a onClick={logout}>Log out</a></li>
                  </ul>
                </div>
              )}
            </ButtonTriggeredDropdown>

            <button
              className='Header__content__button'
              onClick={() => this.setState({ searchOpen: !this.state.searchOpen })}
            >
              <i className='fa fa-search' />
            </button>

            <Modal
              show={this.state.searchOpen}
              onHide={() => this.setState({ searchOpen: false })}
              backdropClassName='Backdrop'
              backdrop
            >
              <Search
                isOpen={this.state.searchOpen}
                onCloseSearch={() => this.setState({ searchOpen: false })}
              />
            </Modal>
          </div>
        </div>
      </header>
    );
  }
}
