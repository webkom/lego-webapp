import '../styles/App.css';
import React, { Component, PropTypes } from 'react';
import HeaderContainer from '../containers/HeaderContainer';

export default class App extends Component {

  static propTypes = {
    children: PropTypes.any
  }

  render() {
    return (
      <div className='Site'>
        <HeaderContainer/>

        {this.props.children}

      </div>
    );
  }
}
