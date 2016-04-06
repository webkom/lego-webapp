import './Root.css';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loginAutomaticallyIfPossible } from 'app/actions/UserActions';
import HeaderContainer from 'app/components/HeaderContainer';

@connect(null, { loginAutomaticallyIfPossible })
export default class Root extends Component {
  static propTypes = {
    loginAutomaticallyIfPossible: PropTypes.func.isRequired,
    children: PropTypes.any.isRequired
  };

  componentWillMount() {
    this.props.loginAutomaticallyIfPossible();
  }

  render() {
    return (
      <div className='Site'>
        <HeaderContainer />
        {this.props.children}
      </div>
    );
  }
}
