'use strict';

var React = require('react');

var RequireLogin = React.createClass({

  getDefaultProps: function() {
    return {
      loggedIn: false
    };
  },

  render: function() {
    var content = this.props.loggedIn ? this.props.children : null;
    return <div>{content}</div>;
  }
});

module.exports = RequireLogin;
