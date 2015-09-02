import React, { Component } from 'react';

export default class RequireLogin extends Component {
  render() {
    const { loggedIn } = this.props;
    return loggedIn ? <div>{this.props.children}</div> : null;
  }
}
