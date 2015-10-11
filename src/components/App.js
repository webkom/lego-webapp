import '../styles/App.css';
import React, { Component, PropTypes } from 'react';
import Header from './Header';

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
    const { dispatch } = this.props;

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
