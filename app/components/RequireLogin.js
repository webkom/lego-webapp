import React, { Component, PropTypes } from 'react';

export default class RequireLogin extends Component {

  static propTypes = {
    children: PropTypes.any,
    loggedIn: PropTypes.bool.isRequired
  };

  render() {
    const { loggedIn } = this.props;
    return loggedIn ? <div>{this.props.children}</div> : null;
  }
}
