import React from 'react';

var RequireLogin = React.createClass({

  getDefaultProps() {
    return {
      loggedIn: false
    };
  },

  render() {
    var content = this.props.loggedIn ? this.props.children : null;
    return <div>{content}</div>;
  }
});

export default RequireLogin;
