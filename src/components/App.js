import '../styles/App.css';
import React, { Component, PropTypes } from 'react';

import HeaderContainer from '../containers/HeaderContainer';
import Footer from '../components/Footer';

export default class App extends Component {

  static propTypes = {
    children: PropTypes.any,
    closeMenu: PropTypes.func.isRequired
  }

  render() {
    return (
      <div className='Site' onClick={this.props.closeMenu}>
        <HeaderContainer/>

          {this.props.children}

        <Footer/>
      </div>
    );
  }
}
