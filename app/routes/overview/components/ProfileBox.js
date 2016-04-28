import './ProfileBox.css';
import React, { Component } from 'react';
import { Link } from 'react-router';
import Icon from 'app/components/icon';
import LoginForm from 'app/components/LoginForm';

const Dropdown = ({ login, logout, user }) => {
  if (user) {
    return (
      <ul className='Dropdown__list'>
        <li>
          <Link to='/users/me'>
            Min profil
            <Icon name='user' />
          </Link>
        </li>
        <li>
          <Link to='/users/me/settings'>
            Instillinger
            <Icon name='cog' />
          </Link>
        </li>
        <li>
          <a onClick={logout}>
            Logg ut
            <Icon name='sign-out' />
          </a>
        </li>
      </ul>
    );
  }

  return <LoginForm login={login} />;
};

export default class ProfileBox extends Component {
  state = {
    open: false
  };

  toggleOpen() {
    this.setState({
      ...this.state,
      open: !this.state.open
    });
  }

  render() {
    const { user } = this.props;
    const nameOrLogin = user ? user.username : 'Logg inn';
    const icon = this.state.open ? 'chevron-up' : 'chevron-down';
    return (
      <div className='Profile'>
        <div className='Profile__bar'>
          <img className='Profile__avatar' src={`http://api.adorable.io/avatars/70/${nameOrLogin}.png`}></img>
          <a
            className='Profile__user'
            onClick={() => this.toggleOpen()}
          >
            <h3>{nameOrLogin}</h3>
            <Icon className='Profile__arrow' name={icon} />
          </a>
        </div>
        {this.state.open &&
          <div className='Dropdown'>
            <Dropdown {...this.props} />
          </div>}
      </div>
    );
  }
}
