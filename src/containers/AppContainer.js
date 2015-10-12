import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loginAutomaticallyIfPossible } from '../actions/UserActions';
import App from '../components/App';

@connect(
  null,
  { loginAutomaticallyIfPossible }
)
export default class AppContainer extends Component {

  static propTypes = {
    loginAutomaticallyIfPossible: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.loginAutomaticallyIfPossible();
  }

  render() {
    return <App {...this.props}/>;
  }
}
