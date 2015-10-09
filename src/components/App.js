import '../styles/App.css';
import React, { Component, PropTypes } from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import { Link } from 'react-router';
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

  render() {
    const { dispatch, menuOpen } = this.props;

    return (
      <div className='Site'>
        <Header
          searchOpen={false}
          accountOpen={false}
          dispatch={dispatch}
        />

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
