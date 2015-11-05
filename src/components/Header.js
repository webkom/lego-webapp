import '../styles/Header.css';
import React, { PropTypes, Component } from 'react';
import { Link, IndexLink } from 'react-router';
import { Modal } from 'react-overlays';
import { debounce } from 'lodash';
import LoginForm from './LoginForm';
import Search from './Search';
import { ButtonTriggeredDropdown } from './ui';

export default class Header extends Component {
  static propTypes = {
    children: PropTypes.array,
    auth: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    searchResults: PropTypes.array.isRequired,
    searching: PropTypes.bool,
    loggedIn: PropTypes.bool.isRequired,
    loginFailed: PropTypes.bool
  }

  state = {
    accountOpen: false,
    searchOpen: false,
    notificationsOpen: false
  }

  render() {
    const {
      login, logout,
      search, searchResults, searching,
      auth,
      loggedIn, loginFailed
    } = this.props;

    return (
      <header className='Header'>
        <div className='Header__content u-container'>
          <IndexLink to='/' className='Header__logo'>Abakus</IndexLink>

          <div className='Header__navigation'>
            <Link to='/events'>Arrangementer</Link>
            <Link to=''>Karriere</Link>
            <Link to=''>README</Link>
          </div>

          <div>
            <ButtonTriggeredDropdown
              buttonClassName='Header__content__button'
              iconName='bell'
              show={this.state.notificationsOpen}
              toggle={() => this.setState({ notificationsOpen: !this.state.notificationsOpen })}
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
                    <li><Link to='events'>My Profile</Link></li>
                    <li><Link to='events'>Settings</Link></li>
                    <li><Link to='events'>Favorites</Link></li>
                    <li><a onClick={logout}>Log out</a></li>
                  </ul>
                </div>
              )}
            </ButtonTriggeredDropdown>

            <button className='Header__content__button' onClick={() => this.setState({ searchOpen: !this.state.searchOpen })}>
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
                onQueryChanged={debounce(search, 500)}
                results={searchResults}
                searching={searching}
              />
            </Modal>
          </div>
        </div>
      </header>
    );
  }
}
