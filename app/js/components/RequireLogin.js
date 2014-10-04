/** @jsx React.DOM */
var React = require('react');
var AuthMixin = require('./AuthMixin');

var RequireLogin = React.createClass({
  mixins: [AuthMixin],

  render: function() {
    if (!this.state.isLoggedIn) return <div></div>;
    return <div>{this.props.children}</div>;
  }
})

module.exports = RequireLogin;
