/** @jsx React.DOM */

var React = require('react');
var Modal = require('./modal');
var Icon  = require('./icon');

var Login = module.exports = React.createClass({

  login: function() {
    this.props.onLogin();
  },

  render: function() {
    return (
      <p className="login-status">
        <img className="gravatar" src="http://www.gravatar.com/avatar/279f5b4c5c781eb6aaa5c3f09c974acf.jpg?s=64&d=identicon" />
        {this.props.auth ?
          <span>Hans-Kristian Seem Koren</span> : <a onClick={this.login}><Icon name='lock'/> Logg inn</a>}
      </p>
    );
  }
});
