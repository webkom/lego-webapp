/** @jsx React.DOM */
var React = require('react');

var RequireLogin = React.createClass({

  getDefaultProps: function() {
    return {
      loggedIn: false
    };
  },

  render: function() {
    if (!this.props.loggedIn) return <div>Login to see this</div>;
    return <div>{this.props.children}</div>;
  }
})

module.exports = RequireLogin;
