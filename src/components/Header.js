import '../styles/Header.css';
import React, { PropTypes, Component } from 'react';
import { Link, IndexLink } from 'react-router';
import { Modal } from 'react-overlays';
import cx from 'classnames';
import LoginForm from './LoginForm';
import { ButtonTriggeredDropdown } from './ui';


const Search = ({ closeSearch }) => (
  <div className={cx('Search')}>
    <div className='Search__overlay u-container'>
      <div className='Search__input'>
        <input type='search' placeholder='Hva leter du etter?' autoFocus />
        <button type='button' className='Search__closeButton' onClick={closeSearch}>
          <i className='fa fa-close u-scale-on-hover' />
        </button>
      </div>
      <div className='Search__results'>
        <ul className='Search__results__items'>
          <li><span className='u-pill'>article</span> Hugh hefner on a roll</li>
          <li><span className='u-pill'>page</span> An awesome page</li>
        </ul>

        <div className='Search__results__quickLinks'>
          <ul>
            <li><a href=''>Interessegrupper</a></li>
            <li><a href=''>Butikk</a></li>
            <li><a href=''>Kontakt</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default class Header extends Component {
  static propTypes = {
    children: PropTypes.array,
    auth: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    search: PropTypes.object.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    loginFailed: PropTypes.bool
  }

  state = {
    accountOpen: false,
    searchOpen: false,
    notificationsOpen: false
  }

  render() {
    const { login, logout, auth, loggedIn, loginFailed } = this.props;

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
              contentClassName={loginFailed && 'animated shake'}
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
              <Search isOpen={this.state.searchOpen} closeSearch={() => this.setState({ searchOpen: false })} />
            </Modal>
          </div>
        </div>
      </header>
    );
  }
}
