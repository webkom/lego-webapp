import React, { Component } from 'react';

export default class RequireLogin extends Component {
  render() {
    const { loggedIn, children } = this.props;
    return loggedIn ? <div>{this.props.children}</div> : null;
  }
}
